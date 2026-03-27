import { Header } from '../../components/Header';
import { ProductCard } from '../../components/ProductCard';
import { Banner } from '../../components/Banner'; 
import { TrustPanel } from '../../components/TrustPanel'; /* <-- NOVA LINHA: Importando o selo da esquerda */
import { SecuritySymbolsPanel } from '../../components/SecuritySymbolsPanel'; /* <-- NOVA LINHA: Importando o novo painel da esquerda */
import { GuaranteePanel } from '../../components/GuaranteePanel'; /* <-- NOVA LINHA: Importando o selo da direita (parte 1) */
import { MoneyBackPanel } from '../../components/MoneyBackPanel'; /* <-- NOVA LINHA: Importando o selo da direita (parte 2) */
import styles from './css/Home.module.css';

export function Home() {
  const produtoDeTeste = {
    title: "Smartphone Samsung Galaxy S24 Ultra 512GB - Câmera 200MP",
    image: "https://http2.mlstatic.com/D_NQ_NP_2X_910069-MLU73617307077_122023-F.webp",
    originalPrice: 7599.00,
    price: 6899.10,
    discount: 10,
    storeName: "SAMSUNG"
  };

  return (
    <div className={styles.pageContainer}>
      {/* O Header fica no topo de tudo */}
      <Header />

      {/* <-- NOVA LINHA: O Banner entra exatamente aqui, abaixo do Header e acima do conteúdo principal */}
      <Banner />

      <main className={styles.contentWrapper}>
        {/* Coluna 1: Painéis de Confiança (Esquerda) */}
        <aside className={styles.sideColumn}>
          {/* <-- ALTERAÇÃO: Inserindo o componente real do selo */}
          <TrustPanel />
          {/* <-- NOVA LINHA: Inserindo o painel de símbolos de segurança abaixo do Só Lojas Oficiais */}
          <SecuritySymbolsPanel />
        </aside>

        {/* Coluna 2: Vitrine de Produtos */}
        <section className={styles.productsGrid}>
           {/* Repetindo o mesmo card algumas vezes só para ver a grade funcionando */}
           <ProductCard {...produtoDeTeste} />
           <ProductCard {...produtoDeTeste} />
           <ProductCard {...produtoDeTeste} />
           <ProductCard {...produtoDeTeste} />
        </section>

        {/* Coluna 3: AdSense / Mais Segurança (Direita) */}
        <aside className={styles.sideColumn}>
          {/* <-- ALTERAÇÃO: Inserindo o componente real do selo da direita */}
          <GuaranteePanel />
          {/* <-- NOVA LINHA: Inserindo a segunda parte do selo da direita */}
          <MoneyBackPanel />
          
          <div style={{ background: 'white', padding: '20px', borderRadius: '8px', minHeight: '300px' }}>
            <h3>Espaço AdSense</h3>
          </div>
        </aside>
      </main>
    </div>
  );
}