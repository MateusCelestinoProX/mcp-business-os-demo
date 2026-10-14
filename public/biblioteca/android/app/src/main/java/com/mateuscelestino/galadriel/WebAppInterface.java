package com.mateuscelestino.galadriel;

import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.os.Build;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.os.VibratorManager;
import android.webkit.JavascriptInterface;
import android.widget.Toast;

public class WebAppInterface {
    private final Context context;

    public WebAppInterface(Context context) {
        this.context = context;
    }

    @JavascriptInterface
    public void copyToClipboard(String text) {
        try {
            ClipboardManager clipboard = (ClipboardManager) context.getSystemService(Context.CLIPBOARD_SERVICE);
            ClipData clip = ClipData.newPlainText("Galadriel Prompt", text);
            if (clipboard != null) {
                clipboard.setPrimaryClip(clip);
                triggerHaptic();
                Toast.makeText(context, "Copiado para a área de transferência!", Toast.LENGTH_SHORT).show();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @JavascriptInterface
    public void triggerHaptic() {
        triggerHapticType("light");
    }

    @JavascriptInterface
    public void triggerHapticType(String type) {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                VibratorManager vibratorManager = (VibratorManager) context.getSystemService(Context.VIBRATOR_MANAGER_SERVICE);
                if (vibratorManager != null) {
                    int effectId = VibrationEffect.EFFECT_CLICK;
                    if ("tick".equalsIgnoreCase(type) || "light".equalsIgnoreCase(type)) {
                        effectId = VibrationEffect.EFFECT_TICK;
                    } else if ("heavy".equalsIgnoreCase(type)) {
                        effectId = VibrationEffect.EFFECT_HEAVY_CLICK;
                    }
                    vibratorManager.getDefaultVibrator().vibrate(
                        VibrationEffect.createPredefined(effectId)
                    );
                }
            } else {
                Vibrator v = (Vibrator) context.getSystemService(Context.VIBRATOR_SERVICE);
                if (v != null && v.hasVibrator()) {
                    long duration = "heavy".equalsIgnoreCase(type) ? 45 : 20;
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                        v.vibrate(VibrationEffect.createOneShot(duration, VibrationEffect.DEFAULT_AMPLITUDE));
                    } else {
                        v.vibrate(duration);
                    }
                }
            }
        } catch (Exception ignored) {
        }
    }

    @JavascriptInterface
    public void showToast(String message) {
        Toast.makeText(context, message, Toast.LENGTH_SHORT).show();
    }

    @JavascriptInterface
    public boolean isNativeAndroid() {
        return true;
    }
}
