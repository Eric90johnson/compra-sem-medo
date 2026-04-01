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
  // --- ALTERAÇÃO: Termo de busca mais amplo para testar a vitrine geral ---
  const [searchTerm, setSearchTerm] = useState('tecnologia'); 

  async function fetchProducts(query) {
    setLoading(true);
    try {
      const token = import.meta.env.VITE_ML_ACCESS_TOKEN;

      console.log("🔑 Sistema verificando credenciais...");

      // --- ESTRATÉGIA DE DESBLOQUEIO 2.0 ---
      // Tentamos buscar usando uma categoria de tecnologia (MLB1648) para ser mais "natural" para a API
      let url = `/ml-api/sites/MLB/search?q=${query}`;
      
      // Se a query for a inicial, usamos um filtro de categoria que costuma ser mais livre de bloqueios
      if (query === 'tecnologia') {
        url = `/ml-api/sites/MLB/search?category=MLB1648`; 
      }

      const response = await fetch(`/ml-api/sites/MLB/search?q=${query}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const erroML = await response.json();
        // Log detalhado para entendermos se o bloqueio é por IP ou Token
        console.error("❌ BLOQUEIO DA POLÍTICA DO ML:", JSON.stringify(erroML, null, 2));
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
          storeName: item.official_store_name || "Vendedor Verificado"
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
                  <p>Aguardando resposta do Mercado Livre. Se o erro 403 persistir no console, pode ser necessário validar sua conta de desenvolvedor.</p>
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