import { Camera, ChartNoAxesColumnIncreasing, PackageSearch } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../theme/colors";
import { AppTab } from "../types";

type TabBarProps = {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
};

const tabs = [
  { id: "scanner", label: "Scan", icon: Camera },
  { id: "inventory", label: "Inventory", icon: PackageSearch },
  { id: "trends", label: "Trends", icon: ChartNoAxesColumnIncreasing }
] as const;

export function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <View style={styles.wrapper}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <Pressable
            accessibilityRole="button"
            key={tab.id}
            onPress={() => onTabChange(tab.id)}
            style={[styles.tab, isActive && styles.activeTab]}
          >
            <Icon color={isActive ? colors.surface : colors.muted} size={20} strokeWidth={2.2} />
            <Text style={[styles.label, isActive && styles.activeLabel]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 12
  },
  tab: {
    alignItems: "center",
    borderRadius: 8,
    flex: 1,
    flexDirection: "row",
    gap: 8,
    height: 48,
    justifyContent: "center"
  },
  activeTab: {
    backgroundColor: colors.green
  },
  label: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "700"
  },
  activeLabel: {
    color: colors.surface
  }
});
