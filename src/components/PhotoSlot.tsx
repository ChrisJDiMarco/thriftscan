import { Camera, ImagePlus } from "lucide-react-native";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../theme/colors";
import { SelectedPhoto } from "../types";

type PhotoSlotProps = {
  label: string;
  photo?: SelectedPhoto;
  onCamera: () => void;
  onLibrary: () => void;
};

export function PhotoSlot({ label, photo, onCamera, onLibrary }: PhotoSlotProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.preview}>
        {photo ? (
          <Image source={{ uri: photo.uri }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <ImagePlus color={colors.green} size={28} strokeWidth={2.1} />
          </View>
        )}
      </View>
      <View style={styles.copy}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.actions}>
          <Pressable accessibilityRole="button" onPress={onCamera} style={styles.iconButton}>
            <Camera color={colors.surface} size={18} strokeWidth={2.2} />
          </Pressable>
          <Pressable accessibilityRole="button" onPress={onLibrary} style={[styles.iconButton, styles.secondaryButton]}>
            <ImagePlus color={colors.green} size={18} strokeWidth={2.2} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 14,
    padding: 12
  },
  preview: {
    aspectRatio: 1,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 8,
    overflow: "hidden",
    width: 92
  },
  image: {
    height: "100%",
    width: "100%"
  },
  placeholder: {
    alignItems: "center",
    height: "100%",
    justifyContent: "center",
    width: "100%"
  },
  copy: {
    flex: 1,
    gap: 12
  },
  label: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: "800"
  },
  actions: {
    flexDirection: "row",
    gap: 10
  },
  iconButton: {
    alignItems: "center",
    backgroundColor: colors.green,
    borderRadius: 8,
    height: 40,
    justifyContent: "center",
    width: 48
  },
  secondaryButton: {
    backgroundColor: colors.greenSoft,
    borderColor: colors.green,
    borderWidth: 1
  }
});
