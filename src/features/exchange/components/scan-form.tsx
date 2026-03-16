"use client";

import jsQR from "jsqr";
import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { ErrorMessage } from "@/components/common/error-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createExchangeAction,
  type ExchangeActionState,
} from "@/features/exchange/actions/exchange-actions";

const initialState: ExchangeActionState = {
  ok: false,
  message: "",
};

type BarcodeDetectorLike = {
  detect: (source: CanvasImageSource) => Promise<Array<{ rawValue?: string }>>;
};

declare global {
  interface Window {
    BarcodeDetector?: new (options?: { formats?: string[] }) => BarcodeDetectorLike;
  }
}

export function ScanForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(createExchangeAction, initialState);
  const [cameraState, setCameraState] = useState<"idle" | "requesting" | "active" | "unsupported">("idle");
  const [cameraMessage, setCameraMessage] = useState("");
  const [qrValue, setQrValue] = useState("");
  const [submitNonce, setSubmitNonce] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const frameRef = useRef<number | null>(null);
  const submittedRef = useRef(false);
  const detectorRef = useRef<BarcodeDetectorLike | null>(null);

  useEffect(() => {
    if (state.ok && state.redirectTo) {
      router.replace(state.redirectTo);
      router.refresh();
    }
  }, [router, state]);

  useEffect(() => {
    if (!submittedRef.current || !qrValue) {
      return;
    }

    formRef.current?.requestSubmit();
  }, [qrValue, submitNonce]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  function stopCamera() {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }

  function resetScanState() {
    stopCamera();
    submittedRef.current = false;
    setQrValue("");
    setCameraState("idle");
    setCameraMessage("");
  }

  function submitDetectedValue(value: string) {
    if (submittedRef.current) {
      return;
    }

    submittedRef.current = true;
    setQrValue(value);
    setSubmitNonce((current) => current + 1);
    stopCamera();
    setCameraState("idle");
    setCameraMessage("QR を読み取りました。交換を進めています。");
  }

  function scanCurrentFrame() {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || video.readyState < 2) {
      frameRef.current = requestAnimationFrame(scanCurrentFrame);
      return;
    }

    const context = canvas.getContext("2d", { willReadFrequently: true });

    if (!context) {
      setCameraMessage("カメラの読み取り準備に失敗しました。");
      stopCamera();
      setCameraState("idle");
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const tryDecode = async () => {
      if (detectorRef.current) {
        try {
          const detected = await detectorRef.current.detect(canvas);
          const rawValue = detected[0]?.rawValue;

          if (rawValue) {
            submitDetectedValue(rawValue);
            return;
          }
        } catch {
          detectorRef.current = null;
        }
      }

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const result = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "attemptBoth",
      });

      if (result?.data) {
        submitDetectedValue(result.data);
        return;
      }

      frameRef.current = requestAnimationFrame(scanCurrentFrame);
    };

    void tryDecode();
  }

  async function startCamera() {
    if (!window.isSecureContext && window.location.hostname !== "localhost") {
      setCameraState("unsupported");
      setCameraMessage("この URL ではカメラ読み取りを利用できません。HTTPS か localhost で開くか、画像アップロードを使ってください。");
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraState("unsupported");
      setCameraMessage("このブラウザではカメラ読み取りを利用できません。");
      return;
    }

    try {
      setCameraState("requesting");
      setCameraMessage("");
      submittedRef.current = false;
      detectorRef.current = window.BarcodeDetector
        ? new window.BarcodeDetector({ formats: ["qr_code"] })
        : null;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: {
            ideal: "environment",
          },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setCameraState("active");
      setCameraMessage("枠の中に相手の QR を入れてください。検出したら自動で交換します。");
      frameRef.current = requestAnimationFrame(scanCurrentFrame);
    } catch {
      stopCamera();
      setCameraState("idle");
      setCameraMessage("カメラを起動できませんでした。ブラウザの権限設定を確認してください。");
    }
  }

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      function detectWithJsQr(context: CanvasRenderingContext2D, width: number, height: number) {
        const imageData = context.getImageData(0, 0, width, height);

        return jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "attemptBoth",
        });
      }

      const tryDecodeImage = async () => {
        if (window.BarcodeDetector) {
          try {
            const detector = new window.BarcodeDetector({ formats: ["qr_code"] });
            const detected = await detector.detect(image);
            const rawValue = detected[0]?.rawValue;

            if (rawValue) {
              URL.revokeObjectURL(imageUrl);
              submitDetectedValue(rawValue);
              return true;
            }
          } catch {
            // Fall back to jsQR below.
          }
        }

        return false;
      };

      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d", { willReadFrequently: true });

      if (!canvas || !context) {
        setCameraMessage("画像の解析に失敗しました。");
        URL.revokeObjectURL(imageUrl);
        return;
      }

      void (async () => {
        if (await tryDecodeImage()) {
          return;
        }

        const scales = [1, 1.5, 2, 3];

        for (const scale of scales) {
          canvas.width = Math.floor(image.width * scale);
          canvas.height = Math.floor(image.height * scale);
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.drawImage(image, 0, 0, canvas.width, canvas.height);

          const result = detectWithJsQr(context, canvas.width, canvas.height);

          if (result?.data) {
            URL.revokeObjectURL(imageUrl);
            submitDetectedValue(result.data);
            return;
          }

          const focusAreas = [
            { x: 0, y: 0, width: canvas.width, height: canvas.height },
            { x: canvas.width * 0.15, y: canvas.height * 0.15, width: canvas.width * 0.7, height: canvas.height * 0.7 },
            { x: canvas.width * 0.25, y: canvas.height * 0.25, width: canvas.width * 0.5, height: canvas.height * 0.5 },
          ];

          for (const area of focusAreas) {
            const cropWidth = Math.floor(area.width);
            const cropHeight = Math.floor(area.height);

            if (cropWidth < 32 || cropHeight < 32) {
              continue;
            }

            const imageData = context.getImageData(
              Math.floor(area.x),
              Math.floor(area.y),
              cropWidth,
              cropHeight,
            );
            const tempCanvas = document.createElement("canvas");
            tempCanvas.width = cropWidth;
            tempCanvas.height = cropHeight;
            const tempContext = tempCanvas.getContext("2d", { willReadFrequently: true });

            if (!tempContext) {
              continue;
            }

            tempContext.putImageData(imageData, 0, 0);
            const croppedResult = detectWithJsQr(tempContext, cropWidth, cropHeight);

            if (croppedResult?.data) {
              URL.revokeObjectURL(imageUrl);
              submitDetectedValue(croppedResult.data);
              return;
            }
          }
        }

        URL.revokeObjectURL(imageUrl);
        setCameraMessage("画像から QR を読み取れませんでした。別画像を試すか、下の入力欄に user ID を直接入れてください。");
      })();
    };

    image.onerror = () => {
      URL.revokeObjectURL(imageUrl);
      setCameraMessage("画像の読み込みに失敗しました。");
    };

    image.src = imageUrl;
  }

  return (
    <form action={formAction} ref={formRef} style={{ display: "grid", gap: 14 }}>
      <div
        style={{
          display: "grid",
          gap: 12,
          padding: 16,
          borderRadius: 22,
          border: "1px solid var(--line)",
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div style={{ display: "grid", gap: 8 }}>
          <strong>カメラ読み取り</strong>
          <p style={{ margin: 0, color: "var(--muted)", fontSize: 14 }}>
            まずはここを試し、うまく読めない場合は下の画像アップロードか user ID 入力に切り替えてください。
          </p>
        </div>
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 22,
            minHeight: 240,
            border: "1px solid rgba(255,255,255,0.18)",
            background:
              "linear-gradient(180deg, rgba(15,23,42,0.86) 0%, rgba(17,24,39,0.92) 100%)",
            display: "grid",
            placeItems: "center",
          }}
        >
          <video
            muted
            playsInline
            ref={videoRef}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: cameraState === "active" ? "block" : "none",
            }}
          />
          {cameraState !== "active" ? (
            <div style={{ padding: 20, textAlign: "center", color: "var(--muted)" }}>
              {cameraState === "requesting" ? "カメラを起動しています..." : "ここにカメラ映像が表示されます"}
            </div>
          ) : (
            <div
              style={{
                position: "absolute",
                inset: 24,
                borderRadius: 24,
                border: "2px solid rgba(255,255,255,0.7)",
                boxShadow: "0 0 0 9999px rgba(7,10,18,0.18)",
              }}
            />
          )}
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Button
            disabled={cameraState === "requesting" || isPending}
            onClick={() => {
              if (cameraState === "active") {
                stopCamera();
                setCameraState("idle");
                setCameraMessage("");
                return;
              }

              void startCamera();
            }}
            type="button"
          >
            {cameraState === "active" ? "カメラを止める" : "カメラを起動する"}
          </Button>
          <label
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "12px 18px",
              borderRadius: 999,
              border: "1px solid var(--line)",
              background: "rgba(255,255,255,0.08)",
              cursor: "pointer",
            }}
          >
            画像から読み取る
            <input
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: "none" }}
              type="file"
            />
          </label>
          {(cameraMessage || qrValue) ? (
            <Button onClick={resetScanState} type="button" variant="secondary">
              入力をリセット
            </Button>
          ) : null}
        </div>
        {cameraMessage ? (
          <p style={{ margin: 0, color: "var(--muted)", fontSize: 14 }}>{cameraMessage}</p>
        ) : null}
        <div
          style={{
            display: "grid",
            gap: 8,
            padding: 14,
            borderRadius: 18,
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.05)",
          }}
        >
          <strong style={{ fontSize: 14 }}>うまく読めないとき</strong>
          <p style={{ margin: 0, color: "var(--muted)", fontSize: 13 }}>
            PC に表示した QR をスマホで読む場合は、スクリーンショットを保存して「画像から読み取る」を使う方が安定します。
          </p>
          <p style={{ margin: 0, color: "var(--muted)", fontSize: 13 }}>
            それでもだめなら、相手の `@userId` を下の入力欄にそのまま入れて交換できます。
          </p>
        </div>
      </div>

      <label style={{ display: "grid", gap: 8 }}>
        <span style={{ color: "var(--muted)", fontSize: 13, letterSpacing: "0.04em" }}>
          QR Value or User ID
        </span>
        <Input
          aria-label="QR Value or User ID"
          name="qrValue"
          placeholder="tanaka"
          onChange={(event) => {
            submittedRef.current = false;
            setQrValue(event.target.value);
          }}
          required
          value={qrValue}
        />
      </label>
      {state.message ? <ErrorMessage message={state.message} /> : null}
      <Button disabled={isPending} type="submit">
        {isPending ? "交換中..." : "交換する"}
      </Button>
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </form>
  );
}
