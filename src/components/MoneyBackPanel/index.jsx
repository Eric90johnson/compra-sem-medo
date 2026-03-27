import styles from './MoneyBackPanel.module.css';

export function MoneyBackPanel() {
  return (
    <div className={styles.panel}>
      <span className={styles.refreshIcon}>🔄</span>
      <p className={styles.text}>RECEBA O QUE COMPROU OU SEU DINHEIRO VOLTA</p>
    </div>
  );
}