import { useState, useEffect } from 'react'; 
import { Header } from '../../components/Header';
import { ProductCard } from '../../components/ProductCard';
import { Banner } from '../../components/Banner'; 
import { TrustPanel } from '../../components/TrustPanel'; 
import { SecuritySymbolsPanel } from '../../components/SecuritySymbolsPanel'; 
import { GuaranteePanel } from '../../components/GuaranteePanel'; 
import { MoneyBackPanel } from '../../components/MoneyBackPanel'; 
import { FilterBar } from '../../components/FilterBar';
import { PaginationBar } from '../../components/PaginationBar'; 
import styles from './css/Home.module.css';

export function Home() {
  
  const [itemsPerPage, setItemsPerPage] = useState(12); 
  const [currentPage, setCurrentPage] = useState(1);   
  const [products, setProducts] = useState([]); 
  const [loading, setLoading] = useState(true); 

  // --- NOVA ESTRATÉGIA: CURADORIA PREMIUM ---
  // Aqui você coloca os IDs dos 12 produtos mais vendidos (1 de cada categoria).
  // Exemplo: O código que fica na URL do produto no ML (MLB...).
  const curatedIds = [
    'MLB3437775983', 'MLB3350711915', 'MLB3856116838', 'MLB3403323049',
    'MLB4317056020', 'MLB3462947110', 'MLB3421060935', 'MLB3446864501',
    'MLB3855523932', 'MLB3505680193', 'MLB3386016259', 'MLB3467645025'
  ].join(',');

  async function fetchProducts() {
    setLoading(true);
    try {
      console.log("🔍 Buscando Curadoria VIP DIRETAMENTE da API Pública...");

      // Endpoint seguro que não exige Token e não dá 403
      let url = `https://api.mercadolibre.com/items?ids=${curatedIds}`;

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Erro: ${response.status}`);
      }

      const data = await response.json();
      
      // A API de itens devolve uma estrutura diferente: um array com { code, body }
      if (data && data.length > 0) {
        const formattedProducts = data.map(item => {
          const produto = item.body;
          
          // Tratamento para caso algum ID seja inválido
          if (!produto.id) return null;

          return {
            id: produto.id,
            title: produto.title,
            image: produto.thumbnail ? produto.thumbnail.replace(/\w\.jpg/g, 'W.jpg') : '', 
            originalPrice: produto.original_price,
            price: produto.price,
            discount: produto.original_price ? Math.round(((produto.original_price - produto.price) / produto.original_price) * 100) : null,
            storeName: "Loja Oficial", // Como é curadoria, assumimos que você escolheu lojas oficiais
            permalink: produto.permalink
          };
        }).filter(Boolean); // Remove qualquer item nulo

        setProducts(formattedProducts);
      } else {
        setProducts([]); 
      }

      setCurrentPage(1); 
    } catch (error) {
      console.error("Erro ao carregar vitrine VIP:", error);
      setProducts([]); 
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Agora não passamos mais searchTerm, ele busca direto a nossa lista VIP
    fetchProducts();
  }, []);

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const displayedProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(products.length / itemsPerPage);

  return (
    <div className={styles.pageContainer}>
      {/* Removemos temporariamente o onSearch do Header, já que a vitrine é fixa */}
      <Header onSearch={() => {}} />

      <Banner />

      <main className={styles.contentWrapper}>
        
        <aside className={styles.sideColumn}>
          <FilterBar />
        </aside>

        <div className={styles.middleColumn}>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2rem', color: '#666' }}>
              <p>Carregando as melhores ofertas do dia...</p>
            </div>
          ) : (
            <section className={styles.productsGrid}>
              {displayedProducts.length > 0 ? (
                displayedProducts.map(produto => (
                  <ProductCard key={produto.id} {...produto} />
                ))
              ) : (
                <div style={{ textAlign: 'center', gridColumn: 'span 3', padding: '20px' }}>
                  <p>Nenhum produto encontrado. Verifique se os IDs no código estão corretos.</p>
                </div>
              )}
            </section>
          )}

          <PaginationBar 
            itemsPerPage={itemsPerPage} 
            setItemsPerPage={setItemsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
        </div>

        <aside className={styles.securityColumn}>
          <TrustPanel />
          <SecuritySymbolsPanel />
          <GuaranteePanel />
          <MoneyBackPanel />
        </aside>

        <div className={styles.separatorLine}></div>

        <aside className={styles.adColumn}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '8px', minHeight: '300px' }}>
            <h3>Espaço AdSense</h3>
          </div>
        </aside>

      </main>

      <div className={styles.stickyFooterAd}>
        <div className={styles.stickyAdContent}>
          Anúncio AdSense (728x90)
        </div>
      </div>
    </div>
  );
}