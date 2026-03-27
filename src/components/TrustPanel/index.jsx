import styles from './TrustPanel.module.css';

export function TrustPanel() {
  return (
    <div className={styles.panel}>
      <h3 className={styles.title}>SÓ LOJAS OFICIAIS</h3>
      
      <div className={styles.iconBadge}>
        <span className={styles.icon}>🛡️</span>
      </div>
      
      <p className={styles.text}>
        <strong>ZERO RISCO:</strong> Compre apenas de marcas consagradas (Nike, Samsung, Arno) com garantia de fábrica.
      </p>
    </div>
  );
}