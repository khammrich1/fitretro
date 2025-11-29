import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors, fonts } from '../../styles/theme';

const ProgressRing = ({
  size = 120,
  strokeWidth = 10,
  progress = 0, // 0-100
  color = colors.neonCyan,
  showPercentage = true,
  centerText,
  centerSubtext,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progressValue = Math.min(Math.max(progress, 0), 100);
  const strokeDashoffset = circumference - (progressValue / 100) * circumference;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        {/* Background circle */}
        <Circle
          stroke={colors.dark}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <Circle
          stroke={color}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{
            shadowColor: color,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.8,
            shadowRadius: 10,
          }}
        />
      </Svg>
      <View style={styles.textContainer}>
        {showPercentage && !centerText && (
          <Text style={[styles.percentage, { color }]}>
            {Math.round(progressValue)}%
          </Text>
        )}
        {centerText && (
          <Text style={[styles.centerText, { color }]}>{centerText}</Text>
        )}
        {centerSubtext && (
          <Text style={styles.centerSubtext}>{centerSubtext}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentage: {
    fontSize: fonts.xxl,
    fontWeight: fonts.bold,
  },
  centerText: {
    fontSize: fonts.xl,
    fontWeight: fonts.bold,
  },
  centerSubtext: {
    fontSize: fonts.sm,
    color: colors.textSecondary,
    marginTop: 4,
  },
});

export default ProgressRing;
