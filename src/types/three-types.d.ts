import * as THREE from 'three';

declare module '@react-three/drei' {
  export const Points: React.ForwardRefExoticComponent<
    React.PropsWithoutRef<{
      positions: Float32Array;
      stride?: number;
      frustumCulled?: boolean;
      [key: string]: any;
    }> &
    React.RefAttributes<THREE.Points>
  >;
  export const PointMaterial: React.FC<{
    size?: number;
    sizeAttenuation?: boolean;
    depthWrite?: boolean;
    transparent?: boolean;
    opacity?: number;
    color?: string;
    [key: string]: any;
  }>;
  export const Preload: React.FC<{ all?: boolean }>;
}

// Augment React-Icons types
declare module 'react-icons/fi' {
  import { IconType } from 'react-icons';
  
  export const FiGithub: IconType;
  export const FiExternalLink: IconType;
  export const FiMail: IconType;
  export const FiPhone: IconType;
  export const FiMapPin: IconType;
  export const FiLinkedin: IconType;
} 