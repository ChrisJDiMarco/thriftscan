import * as ImagePicker from "expo-image-picker";
import { PackagePlus, RefreshCcw, Sparkles } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { AppraisalCard } from "../components/AppraisalCard";
import { PhotoSlot } from "../components/PhotoSlot";
import { analyzeVintagePiece, createMockAppraisal } from "../services/appraiser";
import { colors } from "../theme/colors";
import { SelectedPhoto, VintageAppraisal } from "../types";

type ScannerScreenProps = {
  onSave: (item: VintageAppraisal) => void;
};

export function ScannerScreen({ onSave }: ScannerScreenProps) {
  const [garment, setGarment] = useState<SelectedPhoto>();
  const [tag, setTag] = useState<SelectedPhoto>();
  const [result, setResult] = useState<VintageAppraisal>();
  const [isScanning, setIsScanning] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState<string>();

  const updatePhoto = (target: "garment" | "tag", photo: SelectedPhoto) => {
    if (target === "garment") {
      setGarment(photo);
    } else {
      setTag(photo);
    }

    setResult(undefined);
    setIsSaved(false);
    setError(undefined);
  };

  const takePhoto = async (target: "garment" | "tag") => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Camera blocked", "Camera access is needed to capture thrift finds.");
      return;
    }

    const photo = await launchCamera();
    if (photo) {
      updatePhoto(target, photo);
    }
  };

  const pickPhoto = async (target: "garment" | "tag") => {
    const photo = await launchLibrary();
    if (photo) {
      updatePhoto(target, photo);
    }
  };

  const runScan = async () => {
    setIsScanning(true);
    setError(undefined);
    setIsSaved(false);

    try {
      const appraisal = await analyzeVintagePiece({ garment, tag });
      setResult(appraisal);
    } catch (scanError) {
      setError(scanError instanceof Error ? scanError.message : "Scan failed.");
    } finally {
      setIsScanning(false);
    }
  };

  const runDemo = () => {
    setResult(createMockAppraisal({ garment, tag }));
    setError(undefined);
    setIsSaved(false);
  };

  const saveResult = () => {
    if (!result) {
      return;
    }

    onSave(result);
    setIsSaved(true);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.kicker}>Camera Scanner</Text>
        <Text style={styles.title}>Appraise the rack before someone else does.</Text>
      </View>

      <View style={styles.photoStack}>
        <PhotoSlot
          label="Garment"
          onCamera={() => void takePhoto("garment")}
          onLibrary={() => void pickPhoto("garment")}
          photo={garment}
        />
        <PhotoSlot label="Neck tag" onCamera={() => void takePhoto("tag")} onLibrary={() => void pickPhoto("tag")} photo={tag} />
      </View>

      <View style={styles.actions}>
        <Pressable accessibilityRole="button" disabled={isScanning} onPress={() => void runScan()} style={styles.primaryButton}>
          {isScanning ? (
            <ActivityIndicator color={colors.surface} />
          ) : (
            <>
              <Sparkles color={colors.surface} size={19} strokeWidth={2.3} />
              <Text style={styles.primaryText}>Scan</Text>
            </>
          )}
        </Pressable>
        <Pressable accessibilityRole="button" disabled={isScanning} onPress={runDemo} style={styles.ghostButton}>
          <RefreshCcw color={colors.green} size={18} strokeWidth={2.3} />
          <Text style={styles.ghostText}>Demo</Text>
        </Pressable>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {result ? (
        <View style={styles.resultStack}>
          <AppraisalCard item={result} />
          <Pressable accessibilityRole="button" disabled={isSaved} onPress={saveResult} style={[styles.saveButton, isSaved && styles.savedButton]}>
            <PackagePlus color={isSaved ? colors.green : colors.surface} size={19} strokeWidth={2.3} />
            <Text style={[styles.saveText, isSaved && styles.savedText]}>{isSaved ? "Saved" : "Save"}</Text>
          </Pressable>
        </View>
      ) : null}
    </ScrollView>
  );
}

async function launchCamera(): Promise<SelectedPhoto | undefined> {
  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [4, 5],
    base64: true,
    quality: 0.76
  });

  return extractPhoto(result);
}

async function launchLibrary(): Promise<SelectedPhoto | undefined> {
  const result = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: true,
    aspect: [4, 5],
    base64: true,
    quality: 0.76
  });

  return extractPhoto(result);
}

function extractPhoto(result: ImagePicker.ImagePickerResult): SelectedPhoto | undefined {
  if (result.canceled) {
    return undefined;
  }

  const asset = result.assets[0];
  if (!asset) {
    return undefined;
  }

  return {
    uri: asset.uri,
    base64: asset.base64 ?? undefined,
    mimeType: asset.mimeType ?? "image/jpeg"
  };
}

const styles = StyleSheet.create({
  container: {
    gap: 18,
    padding: 18,
    paddingBottom: 30
  },
  header: {
    gap: 6
  },
  kicker: {
    color: colors.rust,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  title: {
    color: colors.ink,
    fontSize: 27,
    fontWeight: "900",
    lineHeight: 32
  },
  photoStack: {
    gap: 12
  },
  actions: {
    flexDirection: "row",
    gap: 10
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: colors.green,
    borderRadius: 8,
    flex: 1,
    flexDirection: "row",
    gap: 8,
    height: 52,
    justifyContent: "center"
  },
  primaryText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: "900"
  },
  ghostButton: {
    alignItems: "center",
    backgroundColor: colors.greenSoft,
    borderColor: colors.green,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    height: 52,
    justifyContent: "center",
    paddingHorizontal: 18
  },
  ghostText: {
    color: colors.green,
    fontSize: 15,
    fontWeight: "900"
  },
  error: {
    backgroundColor: colors.rustSoft,
    borderRadius: 8,
    color: colors.danger,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
    padding: 12
  },
  resultStack: {
    gap: 12
  },
  saveButton: {
    alignItems: "center",
    backgroundColor: colors.charcoal,
    borderRadius: 8,
    flexDirection: "row",
    gap: 8,
    height: 50,
    justifyContent: "center"
  },
  savedButton: {
    backgroundColor: colors.greenSoft,
    borderColor: colors.green,
    borderWidth: 1
  },
  saveText: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: "900"
  },
  savedText: {
    color: colors.green
  }
});
