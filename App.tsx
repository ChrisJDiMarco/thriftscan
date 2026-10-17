import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

import { TabBar } from "./src/components/TabBar";
import { seedInventory } from "./src/data/demo";
import { InventoryScreen } from "./src/screens/InventoryScreen";
import { ScannerScreen } from "./src/screens/ScannerScreen";
import { TrendsScreen } from "./src/screens/TrendsScreen";
import { colors } from "./src/theme/colors";
import { AppTab, VintageAppraisal } from "./src/types";
import { loadInventory, saveInventory } from "./src/utils/storage";

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>("scanner");
  const [inventory, setInventory] = useState<VintageAppraisal[]>(seedInventory);
  const [hasLoadedInventory, setHasLoadedInventory] = useState(false);

  useEffect(() => {
    let isMounted = true;

    void loadInventory()
      .then((storedInventory) => {
        if (!isMounted) {
          return;
        }

        if (storedInventory?.length) {
          setInventory(storedInventory);
        }
      })
      .finally(() => {
        if (isMounted) {
          setHasLoadedInventory(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (hasLoadedInventory) {
      void saveInventory(inventory);
    }
  }, [hasLoadedInventory, inventory]);

  const screen = useMemo(() => {
    if (activeTab === "inventory") {
      return <InventoryScreen items={inventory} />;
    }

    if (activeTab === "trends") {
      return <TrendsScreen />;
    }

    return (
      <ScannerScreen
        onSave={(item) => {
          setInventory((currentInventory) => [item, ...currentInventory.filter((current) => current.id !== item.id)]);
          setActiveTab("inventory");
        }}
      />
    );
  }, [activeTab, inventory]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.shell}>
        <View style={styles.topBar}>
          <Text style={styles.logo}>ThriftScan</Text>
          <View style={styles.liveDot} />
        </View>
        <View style={styles.screen}>{screen}</View>
        <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    alignItems: "center",
    backgroundColor: colors.background,
    flex: 1
  },
  shell: {
    backgroundColor: colors.background,
    flex: 1,
    maxWidth: 540,
    width: "100%"
  },
  topBar: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 56,
    paddingHorizontal: 18
  },
  logo: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: "900"
  },
  liveDot: {
    backgroundColor: colors.rust,
    borderRadius: 5,
    height: 10,
    width: 10
  },
  screen: {
    flex: 1
  }
});
