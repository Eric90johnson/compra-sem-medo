import styles from './PaginationBar.module.css';

// ALTERAÇÃO: Agora recebe propriedades (props) do componente Home
export function PaginationBar({ itemsPerPage, setItemsPerPage, currentPage, setCurrentPage, totalPages }) {
  
  // <-- NOVA LÓGICA: Tratamento para mudança de quantidade -->
  const handleItemsPerPageChange = (event) => {
    const newQuantity = parseInt(event.target.value, 10);
    setItemsPerPage(newQuantity);
    setCurrentPage(1); // Reseta para a página 1 ao mudar a quantidade
  };

  return (
    <div className={styles.paginationContainer}>
      
      {/* Lado Esquerdo: Quantidade de Itens por Página */}
      <div className={styles.itemsPerPage}>
        <span>Exibir:</span>
        {/* <-- ALTERAÇÃO: select vinculado ao estado itemsPerPage --> */}
        <select 
          className={styles.select} 
          value={itemsPerPage} 
          onChange={handleItemsPerPageChange}
        >
          {/* ALTERADO: Valores agora são múltiplos de 3 para não deixar buracos na grade */}
          <option value="12">12 produtos</option>
          <option value="24">24 produtos</option>
          <option value="48">48 produtos</option>
        </select>
      </div>

      {/* Lado Direito: Botões de navegação */}
      <div className={styles.pageControls}>
        {/* <-- ALTERAÇÃO: Botões agora funcionais baseados na página atual --> */}
        <button 
          className={styles.pageButton} 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          &lt; Anterior
        </button>
        
        {/* <-- ALTERAÇÃO: Texto dinâmico --> */}
        <span className={styles.pageInfo}>Página {currentPage} de {totalPages || 1}</span>
        
        <button 
          className={styles.pageButton}
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          Próxima &gt;
        </button>
      </div>

    </div>
  );
}