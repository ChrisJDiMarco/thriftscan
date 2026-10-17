import { CalendarDays, DollarSign, Shirt, Tag } from "lucide-react-native";
import type { ReactNode } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import { colors, shadow } from "../theme/colors";
import { VintageAppraisal } from "../types";

type AppraisalCardProps = {
  item: VintageAppraisal;
  compact?: boolean;
};

export function AppraisalCard({ item, compact = false }: AppraisalCardProps) {
  const heroUri = item.images.garmentUri || item.images.tagUri;

  return (
    <View style={[styles.card, !compact && shadow]}>
      {heroUri ? <Image source={{ uri: heroUri }} style={styles.hero} /> : null}
      <View style={styles.body}>
        <View style={styles.rowBetween}>
          <Text numberOfLines={2} style={styles.title}>
            {item.title}
          </Text>
          <View style={styles.valuePill}>
            <DollarSign color={colors.green} size={15} strokeWidth={2.4} />
            <Text style={styles.valueText}>
              {item.valueLow}-{item.valueHigh}
            </Text>
          </View>
        </View>

        <View style={styles.metaGrid}>
          <Meta icon={<Tag color={colors.rust} size={16} />} label={item.brand} />
          <Meta icon={<CalendarDays color={colors.gold} size={16} />} label={item.era} />
          <Meta icon={<Shirt color={colors.green} size={16} />} label={item.category} />
        </View>

        {!compact ? (
          <>
            <Text style={styles.sectionTitle}>Signals</Text>
            <View style={styles.signalWrap}>
              {[...item.tagFindings, ...item.manufactureSignals].slice(0, 5).map((signal) => (
                <Text key={signal} style={styles.signal}>
                  {signal}
                </Text>
              ))}
            </View>

            <Text style={styles.advice}>{item.pricingAdvice}</Text>
          </>
        ) : null}
      </View>
    </View>
  );
}

function Meta({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <View style={styles.meta}>
      {icon}
      <Text numberOfLines={1} style={styles.metaText}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    overflow: "hidden"
  },
  hero: {
    aspectRatio: 1.8,
    width: "100%"
  },
  body: {
    gap: 12,
    padding: 14
  },
  rowBetween: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between"
  },
  title: {
    color: colors.ink,
    flex: 1,
    fontSize: 18,
    fontWeight: "900",
    lineHeight: 23
  },
  valuePill: {
    alignItems: "center",
    backgroundColor: colors.greenSoft,
    borderRadius: 8,
    flexDirection: "row",
    gap: 2,
    minHeight: 34,
    paddingHorizontal: 8
  },
  valueText: {
    color: colors.green,
    fontSize: 13,
    fontWeight: "900"
  },
  metaGrid: {
    gap: 8
  },
  meta: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8
  },
  metaText: {
    color: colors.muted,
    flex: 1,
    fontSize: 13,
    fontWeight: "700"
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  signalWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  signal: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 8,
    color: colors.charcoal,
    fontSize: 12,
    fontWeight: "700",
    paddingHorizontal: 9,
    paddingVertical: 6
  },
  advice: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20
  }
});
