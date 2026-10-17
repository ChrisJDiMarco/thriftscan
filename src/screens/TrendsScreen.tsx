import { ArrowDownRight, ArrowUpRight, Flame, Minus } from "lucide-react-native";
import type { DimensionValue } from "react-native";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { trendSignals } from "../data/demo";
import { colors } from "../theme/colors";
import { TrendSignal } from "../types";

const maxAbsChange = Math.max(...trendSignals.map((trend) => Math.abs(trend.change)));

export function TrendsScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.kicker}>Market Trends</Text>
        <Text style={styles.title}>What is worth pulling this week.</Text>
      </View>

      <View style={styles.signalList}>
        {trendSignals.map((signal) => (
          <TrendRow key={signal.id} signal={signal} />
        ))}
      </View>
    </ScrollView>
  );
}

function TrendRow({ signal }: { signal: TrendSignal }) {
  const barWidth: DimensionValue = `${Math.max(8, (Math.abs(signal.change) / maxAbsChange) * 100)}%`;
  const tone = getTone(signal);
  const Icon = getIcon(signal);

  return (
    <View style={styles.row}>
      <View style={styles.rowHeader}>
        <View style={[styles.iconBox, { backgroundColor: tone.soft }]}>
          <Icon color={tone.main} size={18} strokeWidth={2.3} />
        </View>
        <View style={styles.titleStack}>
          <Text style={styles.signalLabel}>{signal.label}</Text>
          <Text style={styles.category}>{signal.category}</Text>
        </View>
        <Text style={[styles.change, { color: tone.main }]}>{signal.change > 0 ? `+${signal.change}%` : `${signal.change}%`}</Text>
      </View>

      <View style={styles.track}>
        <View style={[styles.bar, { backgroundColor: tone.main, width: barWidth }]} />
      </View>

      <Text style={styles.note}>{signal.note}</Text>
    </View>
  );
}

function getTone(signal: TrendSignal) {
  if (signal.velocity === "breakout") {
    return { main: colors.rust, soft: colors.rustSoft };
  }

  if (signal.velocity === "cooling") {
    return { main: colors.muted, soft: colors.surfaceAlt };
  }

  if (signal.change > 10) {
    return { main: colors.green, soft: colors.greenSoft };
  }

  return { main: colors.gold, soft: colors.goldSoft };
}

function getIcon(signal: TrendSignal) {
  if (signal.velocity === "breakout") {
    return Flame;
  }

  if (signal.velocity === "cooling") {
    return ArrowDownRight;
  }

  if (signal.change > 0) {
    return ArrowUpRight;
  }

  return Minus;
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
  signalList: {
    gap: 12
  },
  row: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
    padding: 14
  },
  rowHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12
  },
  iconBox: {
    alignItems: "center",
    borderRadius: 8,
    height: 38,
    justifyContent: "center",
    width: 38
  },
  titleStack: {
    flex: 1,
    gap: 2
  },
  signalLabel: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: "900"
  },
  category: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  change: {
    fontSize: 17,
    fontWeight: "900"
  },
  track: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 8,
    height: 10,
    overflow: "hidden"
  },
  bar: {
    borderRadius: 8,
    height: "100%"
  },
  note: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 18
  }
});
