import styles from './Header.module.css';

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.topContainer}>
        {/* Logo / Nome do Site */}
        <div className={styles.logo}>
          <span className={styles.shieldIcon}>🛡️</span>
          <h1>COMPRA<br/>SEM MEDO</h1>
        </div>

        {/* Menu de Navegação */}
        <nav className={styles.nav}>
          <a href="#">Início</a>
          <a href="#">Dicas de Segurança</a>
          <a href="#">Como Funciona</a>
          <a href="#">Lojas Oficiais</a>
        </nav>
      </div>

      {/* Barra de Pesquisa */}
      <div className={styles.searchContainer}>
        <input 
          type="text" 
          placeholder="🔍 Busque um produto seguro..." 
          className={styles.searchInput}
        />
      </div>
    </header>
  );
}