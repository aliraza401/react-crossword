import React, { useContext, useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { CrosswordContext } from './context';
import type { Direction, EnhancedProps } from './types';

import Clue from './Clue';

const directionCluesPropTypes = {
  direction: PropTypes.string.isRequired,
  label: PropTypes.string,
};

export type DirectionCluesProps = EnhancedProps<
  typeof directionCluesPropTypes,
  { direction: Direction }
>;

// Styled components
const SliderContainer = styled.div`
  position: relative;
  overflow: hidden;
  margin-top: 0;
`;

const SlideButton = styled.span`
  position: absolute;
  top: -2px;
  z-index: 2;
  border-radius: 50%;
  font-size: 22px;
  cursor: pointer;
`;

const PrevButton = styled(SlideButton)`
  left: 0;
`;

const NextButton = styled(SlideButton)`
  right: 0;
`;

const Slider = styled.div`
  display: flex;
  transition: transform 0.3s ease;
`;

const Slide = styled.div`
  flex: 0 0 100%;
  margin-left: 15px;
`;

export default function DirectionClues({
  direction,
  label,
}: DirectionCluesProps) {
  const { clues } = useContext(CrosswordContext);
  const [currentClueIndex, setCurrentClueIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement | null>(null);

  const next = () => {
    if (clues && clues[direction]) {
      setCurrentClueIndex(
        (prevIndex) => (prevIndex + 1) % clues[direction].length
      );
    }
  };

  const previous = () => {
    if (clues && clues[direction]) {
      setCurrentClueIndex(
        (prevIndex) =>
          (prevIndex - 1 + clues[direction].length) % clues[direction].length
      );
    }
  };

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.style.transform = `translateX(-${
        currentClueIndex * 100
      }%)`;
    }
  }, [currentClueIndex]);

  return (
    <div className="direction">
      <h5 className="header">{label || direction.toUpperCase()}</h5>
      <SliderContainer>
        <PrevButton onClick={previous}>{'<'}</PrevButton>
        <NextButton onClick={next}>{'>'}</NextButton>
        <Slider ref={sliderRef}>
          {clues &&
            clues[direction] &&
            clues[direction].map(({ number, clue, complete, correct }) => (
              <Slide key={number}>
                <Clue
                  direction={direction}
                  number={number}
                  complete={complete}
                  correct={correct}
                >
                  {clue}
                </Clue>
              </Slide>
            ))}
        </Slider>
      </SliderContainer>
    </div>
  );
}

DirectionClues.propTypes = directionCluesPropTypes;

DirectionClues.defaultProps = {
  label: undefined,
};
