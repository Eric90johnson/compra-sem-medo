import styles from './Banner.module.css';

export function Banner() {
  return (
    <div className={styles.bannerContainer}>
      <div className={styles.content}>
        
        {/* Lado Esquerdo: Textos e Cronômetro */}
        <div className={styles.textSection}>
          <h2>OFERTAS DO DIA<br/>EM LOJAS OFICIAIS!</h2>
          <div className={styles.timerContainer}>
            <span>TERMINA EM:</span>
            <span className={styles.timer}>14:30:00</span>
          </div>
        </div>

        {/* Lado Direito: Representação visual dos produtos em destaque */}
        <div className={styles.imageSection}>
           <div className={styles.mockImage}>📺</div>
           <div className={styles.mockImage}>👟</div>
           <div className={styles.mockImage}>🎮</div>
        </div>

      </div>
    </div>
  );
}