import { motion } from 'framer-motion';

export default function StarField() {
  const stars = Array.from({ length: 150 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 2,
  }));

  const shootingStars = Array.from({ length: 3 }, (_, i) => ({
    id: i,
    delay: i * 4 + Math.random() * 2,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute bg-emerald-400 rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
          }}
        />
      ))}

      {stars.slice(0, 20).map((star) => (
        <motion.div
          key={`twinkle-${star.id}`}
          className="absolute"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20">
            <motion.path
              d="M10 0 L10.5 9.5 L20 10 L10.5 10.5 L10 20 L9.5 10.5 L0 10 L9.5 9.5 Z"
              fill="rgba(16, 185, 129, 0.4)"
              animate={{
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          </svg>
        </motion.div>
      ))}

      {shootingStars.map((star) => (
        <motion.div
          key={`shooting-${star.id}`}
          className="absolute w-1 h-1 bg-gradient-to-r from-emerald-400 to-transparent rounded-full"
          initial={{
            left: '0%',
            top: `${20 + star.id * 20}%`,
            opacity: 0,
            scaleX: 0,
          }}
          animate={{
            left: '100%',
            opacity: [0, 1, 0],
            scaleX: [0, 50, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: star.delay,
            repeatDelay: 8,
            ease: 'easeOut',
          }}
          style={{
            transformOrigin: 'left',
          }}
        />
      ))}

      <motion.div
        className="absolute inset-0 bg-gradient-radial from-emerald-500/5 via-transparent to-transparent"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
        }}
      />
    </div>
  );
}
