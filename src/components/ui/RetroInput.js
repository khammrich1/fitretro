import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { colors, fonts, spacing, borderRadius } from '../../styles/theme';

const RetroInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  editable = true,
  multiline = false,
  numberOfLines = 1,
  error,
  glowColor = 'purple', // purple, cyan, pink
  style,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const getGlowColor = () => {
    switch (glowColor) {
      case 'cyan':
        return colors.neonCyan;
      case 'pink':
        return colors.neonPink;
      case 'purple':
        return colors.neonPurple;
      default:
        return colors.neonPurple;
    }
  };

  const focusedStyle = isFocused
    ? {
        borderColor: getGlowColor(),
        shadowColor: getGlowColor(),
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 8,
        elevation: 5,
      }
    : {};

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            focusedStyle,
            error && styles.inputError,
            multiline && styles.multiline,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={editable}
          multiline={multiline}
          numberOfLines={numberOfLines}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {secureTextEntry && (
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Text style={styles.eyeText}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: fonts.md,
    fontWeight: fonts.medium,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    backgroundColor: colors.dark,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: fonts.md,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.neonPurple,
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    fontSize: fonts.sm,
    color: colors.error,
    marginTop: spacing.xs,
  },
  eyeIcon: {
    position: 'absolute',
    right: spacing.md,
    top: spacing.md,
  },
  eyeText: {
    fontSize: fonts.xl,
  },
});

export default RetroInput;
