import styles from './Header.module.css';

// ALTERADO: Adicionada a prop onSearch para comunicar a busca com o componente Home
export function Header({ onSearch }) {

  // NOVA FUNÇÃO: Captura o pressionamento de tecla e dispara a busca se for "Enter"
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && event.target.value.trim() !== "") {
      onSearch(event.target.value);
    }
  };

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
          /* ALTERADO: Placeholder atualizado para um tom mais profissional */
          placeholder="Busque marcas, produtos e muito mais..." 
          className={styles.searchInput}
          /* ADICIONADO: Evento para detectar quando o usuário termina de digitar */
          onKeyDown={handleKeyDown}
        />
      </div>
    </header>
  );
}