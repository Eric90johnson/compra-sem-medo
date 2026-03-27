import styles from './SecuritySymbolsPanel.module.css';

export function SecuritySymbolsPanel() {
  return (
    <div className={styles.panel}>
      <h3 className={styles.title}>SÍMBOLOS DE<br/><span className={styles.highlight}>SEGURANÇA</span></h3>
      <p className={styles.text}>
        Identificar uma loja segura na MLC, pode ser um grande diferencial, procure sempre por quem tem a loja segurada.
      </p>
    </div>
  );
}