import React, { memo } from 'react';
import { Dimensions } from 'react-native';
import WheelPickerExpo from 'react-native-wheel-picker-expo';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';

const SCREEN_WIDTH = Dimensions.get('window').width;

/**
 * NumberWheel — bigger spacing & larger numbers.
 */
export default memo(function NumberWheel({
  range,
  value,
  onChange,
  enterAnimation = 'fade',
  wheelHeight = 160, // ↑ more space between green lines
  rowHeight = 55,    // ↑ distance between items
  fontSize = 26,     // ↑ larger text
}) {
  const items = range.map(n => ({ label: String(n), value: n }));
  const selectedIndex = Math.max(range.indexOf(Number(value)), 0);

  const entering =
    enterAnimation === 'slide'
      ? SlideInUp.springify().damping(12)
      : FadeIn.duration(600);

  return (
    <Animated.View entering={entering} style={{ alignSelf: 'center' }}>
      <WheelPickerExpo
        haptics
        // overall picker size
        height={wheelHeight}
        width={SCREEN_WIDTH * 0.8}
        // spacing between rows (supported prop as of v2.1+)
        itemHeight={rowHeight}

        backgroundColor="transparent"
        items={items}
        initialSelectedIndex={selectedIndex}
        textStyle={{ fontSize, fontWeight: '600', color: '#333' }}
        selectedTextStyle={{ fontSize: fontSize + 2, fontWeight: '700', color: '#000' }}
        selectedStyle={{
          borderColor: '#16c784',
          borderWidth: 2,
          height: rowHeight, // keep the highlight exactly one row tall
        }}
        onChange={({ item }) => onChange(String(item.label))}
      />
    </Animated.View>
  );
});
