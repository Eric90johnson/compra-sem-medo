// src/components/ProductCard/index.jsx
import styles from './ProductCard.module.css';

// Estamos definindo quais dados o cartão precisará receber
// --- ALTERAÇÃO: Adicionamos a propriedade 'permalink' ---
export function ProductCard({ image, title, originalPrice, price, discount, storeName, permalink }) {
  
  // Lógica simples para formatar os preços em Real (BRL)
  const formatPrice = (value) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className={styles.card}>
      {/* Selo de desconto no topo, se houver */}
      {discount && (
        <span className={styles.discountTag}>{discount}% OFF</span>
      )}

      {/* Imagem do Produto */}
      <img src={image} alt={title} className={styles.image} />

      <div className={styles.details}>
        {/* Nome da Loja Oficial (Nosso diferencial de segurança) */}
        <p className={styles.storeTag}>Loja Oficial: {storeName}</p>
        
        {/* Título do Produto */}
        <h3 className={styles.title}>{title}</h3>

        {/* Container de Preços */}
        <div className={styles.priceContainer}>
          {originalPrice && (
            <span className={styles.originalPrice}>{formatPrice(originalPrice)}</span>
          )}
          <span className={styles.currentPrice}>{formatPrice(price)}</span>
        </div>

        {/* Selo de Confiança Institucional */}
        <p className={styles.trustInfo}>🛡️ Compra Garantida</p>
      </div>

      {/* Botão de Ação - A grande chamada estratégica */}
      {/* --- ALTERAÇÃO: Transformamos o <button> em uma tag <a> de link com atributos de segurança --- */}
      <a 
        href={permalink} 
        target="_blank" 
        rel="noopener noreferrer" 
        className={styles.buyButton}
      >
        COMPRAR NO<br/>MERCADO LIVRE
      </a>
    </div>
  );
}