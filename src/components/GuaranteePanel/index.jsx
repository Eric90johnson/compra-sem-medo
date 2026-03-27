import styles from './GuaranteePanel.module.css';

export function GuaranteePanel() {
  return (
    <div className={styles.panel}>
      <div className={styles.topSection}>
        <span className={styles.shieldIcon}>🛡️</span>
        <h3 className={styles.title}>COMPRA<br/>100%<br/>SEGURA</h3>
      </div>
      
      {/* ALTERAÇÃO: O divider e a bottomSection foram removidos daqui pois agora serão um componente separado */}
    </div>
  );
}