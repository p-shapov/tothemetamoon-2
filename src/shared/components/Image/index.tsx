import cn from 'classnames';
import NextImage from 'next/image';
import { FC, useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import styles from './Image.module.scss';

export type ImageProps = {
  src?: `images/${string}`;
  extSrc?: string;
  alt?: string;
  lazy?: boolean;
  timeout?: number;
  width?: number;
  height?: number;
  priority?: boolean;
};

export const Image: FC<ImageProps> = ({
  src: internalSrc,
  extSrc = '',
  alt,
  timeout,
  lazy,
  width,
  height,
  priority,
}) => {
  const [loaded, setLoaded] = useState(false);
  const timeoutId = useRef<ReturnType<typeof setTimeout>>();
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '200px 0px',
    skip: !lazy,
  });

  const src = `/${internalSrc}` || extSrc;

  useEffect(() => {
    return () => {
      if (timeoutId.current) clearTimeout(timeoutId.current);
    };
  }, []);

  const handleLoad = () => {
    if (timeout) timeoutId.current = setTimeout(() => setLoaded(true), timeout);
    else setLoaded(true);
  };

  return (
    <div ref={ref} className={cn(styles['root'], loaded && styles['root--loaded'])} style={{ width, height }}>
      <NextImage
        src={inView || !lazy ? src : ''}
        alt={alt}
        layout="fill"
        onLoad={handleLoad}
        priority={priority}
        quality={100}
      />
    </div>
  );
};
