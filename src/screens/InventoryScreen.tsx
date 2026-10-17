import { Box, DollarSign, Shirt } from "lucide-react-native";
import type { ReactNode } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { AppraisalCard } from "../components/AppraisalCard";
import { colors } from "../theme/colors";
import { VintageAppraisal } from "../types";

type InventoryScreenProps = {
  items: VintageAppraisal[];
};

export function InventoryScreen({ items }: InventoryScreenProps) {
  const totalLow = items.reduce((sum, item) => sum + item.valueLow, 0);
  const totalHigh = items.reduce((sum, item) => sum + item.valueHigh, 0);
  const averageValue = items.length ? Math.round((totalLow + totalHigh) / 2 / items.length) : 0;
  const topCategory = getTopCategory(items);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.kicker}>Saved Inventory</Text>
        <Text style={styles.title}>{items.length} pieces in play</Text>
      </View>

      <View style={styles.metrics}>
        <Metric icon={<DollarSign color={colors.green} size={18} />} label="Range" value={`$${totalLow}-$${totalHigh}`} />
        <Metric icon={<Box color={colors.rust} size={18} />} label="Avg" value={`$${averageValue}`} />
        <Metric icon={<Shirt color={colors.gold} size={18} />} label="Lead" value={topCategory} />
      </View>

      <View style={styles.list}>
        {items.map((item) => (
          <AppraisalCard compact item={item} key={item.id} />
        ))}
      </View>
    </ScrollView>
  );
}

function Metric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <View style={styles.metric}>
      <View style={styles.metricIcon}>{icon}</View>
      <Text numberOfLines={1} style={styles.metricValue}>
        {value}
      </Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

function getTopCategory(items: VintageAppraisal[]): string {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.category, (counts.get(item.category) || 0) + 1);
  }

  const top = [...counts.entries()].sort((first, second) => second[1] - first[1])[0];
  return top?.[0] || "None";
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
    fontSize: 28,
    fontWeight: "900",
    lineHeight: 33
  },
  metrics: {
    flexDirection: "row",
    gap: 10
  },
  metric: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    gap: 6,
    minHeight: 112,
    padding: 12
  },
  metricIcon: {
    alignItems: "center",
    backgroundColor: colors.surfaceAlt,
    borderRadius: 8,
    height: 34,
    justifyContent: "center",
    width: 34
  },
  metricValue: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: "900"
  },
  metricLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  list: {
    gap: 12
  }
});
