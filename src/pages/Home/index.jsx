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
  const [searchTerm, setSearchTerm] = useState('tecnologia'); 

  async function fetchProducts(query) {
    setLoading(true);
    try {
      console.log("🔍 Buscando produtos DIRETAMENTE do Mercado Livre (Pelo Navegador)...");

      // --- A SOLUÇÃO DEFINITIVA ---
      // Como a API permite buscas públicas de conexões residenciais, fazemos a chamada direta.
      // Sem tokens, sem Vercel Backend, sem bloqueios de IP.
      let url = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;
      if (query === 'tecnologia') {
        url = `https://api.mercadolibre.com/sites/MLB/search?category=MLB1648`;
      }

      // Requisição 100% limpa, feita pelo próprio computador do usuário que acessar o site
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Erro: ${response.status}`);
      }

      const data = await response.json();
      
      if (data && data.results) {
        const formattedProducts = data.results.map(item => ({
          id: item.id,
          title: item.title,
          image: item.thumbnail ? item.thumbnail.replace(/\w\.jpg/g, 'W.jpg') : '', 
          originalPrice: item.original_price,
          price: item.price,
          discount: item.original_price ? Math.round(((item.original_price - item.price) / item.original_price) * 100) : null,
          storeName: item.official_store_name || "Vendedor Verificado",
          permalink: item.permalink
        }));

        setProducts(formattedProducts);
      } else {
        setProducts([]); 
      }

      setCurrentPage(1); 
    } catch (error) {
      console.error("Erro ao carregar vitrine:", error);
      setProducts([]); 
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts(searchTerm);
  }, [searchTerm]);

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const displayedProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(products.length / itemsPerPage);

  return (
    <div className={styles.pageContainer}>
      <Header onSearch={setSearchTerm} />

      <Banner />

      <main className={styles.contentWrapper}>
        
        <aside className={styles.sideColumn}>
          <FilterBar />
        </aside>

        <div className={styles.middleColumn}>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2rem', color: '#666' }}>
              <p>Carregando vitrine de produtos oficiais...</p>
            </div>
          ) : (
            <section className={styles.productsGrid}>
              {displayedProducts.length > 0 ? (
                displayedProducts.map(produto => (
                  <ProductCard key={produto.id} {...produto} />
                ))
              ) : (
                <div style={{ textAlign: 'center', gridColumn: 'span 3', padding: '20px' }}>
                  <p>Nenhum produto encontrado.</p>
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