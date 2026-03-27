import styles from './FilterBar.module.css';

export function FilterBar() {
  // Versão básica para quando não há busca ativa
  return (
    <aside className={styles.filterBar}>
      <h2 className={styles.mainTitle}>Filtros</h2>

      {/* Categorias Gerais */}
      <div className={styles.filterSection}>
        <h3 className={styles.filterTitle}>Categorias</h3>
        <ul className={styles.filterList}>
          <li><a href="#">Eletrônicos</a></li>
          <li><a href="#">Casa e Móveis</a></li>
          <li><a href="#">Moda</a></li>
          <li><a href="#">Esportes e Fitness</a></li>
          <li><a href="#">Ferramentas</a></li>
        </ul>
      </div>

      {/* Toggles de Conveniência (Sempre úteis) */}
      <div className={styles.filterSection}>
        <div className={styles.toggleGroup}>
          <label className={styles.toggleItem}>
            <input type="checkbox" />
            <span className={styles.toggleText}>Lojas Oficiais</span>
          </label>
          <label className={styles.toggleItem}>
            <input type="checkbox" />
            <span className={styles.freeShipping}>Frete grátis</span>
          </label>
          <label className={styles.toggleItem}>
            <input type="checkbox" />
            <span className={styles.toggleText}>⚡ FULL</span>
          </label>
        </div>
      </div>

      {/* Preço (Range Básico) */}
      <div className={styles.filterSection}>
        <h3 className={styles.filterTitle}>Preço</h3>
        <ul className={styles.filterList}>
          <li><a href="#">Até R$ 50</a></li>
          <li><a href="#">R$ 50 a R$ 200</a></li>
          <li><a href="#">Mais de R$ 200</a></li>
        </ul>
        <div className={styles.priceInputs}>
          <input type="number" placeholder="Mínimo" className={styles.priceInput} />
          <input type="number" placeholder="Máximo" className={styles.priceInput} />
          <button className={styles.applyButton}>&gt;</button>
        </div>
      </div>

      {/* Condição */}
      <div className={styles.filterSection}>
        <h3 className={styles.filterTitle}>Condição</h3>
        <ul className={styles.filterList}>
          <li><a href="#">Novo</a></li>
          <li><a href="#">Usado</a></li>
        </ul>
      </div>
    </aside>
  );
}