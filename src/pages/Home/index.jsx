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
  
  const [searchQuery, setSearchQuery] = useState(''); 
  const [totalProducts, setTotalProducts] = useState(0); 

  async function fetchProducts() {
    setLoading(true);
    try {
      const offset = (currentPage - 1) * itemsPerPage;
      
      // A MÁGICA: O navegador do usuário faz o pedido direto para o ML, burlando o bloqueio de Data Centers!
      let url = `https://api.mercadolibre.com/sites/MLB/search?category=MLB1648&sort=sold_quantity&limit=${itemsPerPage}&offset=${offset}`;
      
      if (searchQuery) {
        url = `https://api.mercadolibre.com/sites/MLB/search?q=${encodeURIComponent(searchQuery)}&limit=${itemsPerPage}&offset=${offset}`;
      }

      console.log(`🔍 Buscando direto na fonte: ${url}`);

      // Chamada direta do Front-End
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Erro na API do ML: ${response.status}`);

      const data = await response.json();
      
      if (data && data.results && data.results.length > 0) {
        const formattedProducts = data.results.map(produto => {
          if (!produto || !produto.id || produto.price === undefined) return null;

          return {
            id: produto.id,
            title: produto.title,
            // Aumenta a qualidade da imagem trocando a letra 'I' (pequena) por 'W' (grande)
            image: produto.thumbnail ? produto.thumbnail.replace(/-I\.jpg/g, '-W.jpg') : '', 
            originalPrice: produto.original_price,
            price: produto.price,
            discount: produto.original_price ? Math.round(((produto.original_price - produto.price) / produto.original_price) * 100) : null,
            storeName: produto.official_store_name || "Loja Parceira",
            permalink: produto.permalink
          };
        }).filter(Boolean); 

        setProducts(formattedProducts);
        
        if (data.paging && data.paging.total) {
          setTotalProducts(data.paging.total);
        } else {
          setTotalProducts(formattedProducts.length);
        }

      } else {
        setProducts([]); 
        setTotalProducts(0);
      }

    } catch (error) {
      console.error("❌ Erro ao carregar vitrine automatizada:", error);
      setProducts([]); 
      setTotalProducts(0);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, [currentPage, itemsPerPage, searchQuery]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); 
  };

  const totalPages = itemsPerPage > 0 ? Math.ceil(totalProducts / itemsPerPage) : 0;

  return (
    <div className={styles.pageContainer}>
      <Header onSearch={handleSearch} />

      <Banner />

      <main className={styles.contentWrapper}>
        
        <aside className={styles.sideColumn}>
          <FilterBar />
        </aside>

        <div className={styles.middleColumn}>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2rem', color: '#666' }}>
              <p>Carregando as melhores ofertas...</p>
            </div>
          ) : (
            <section className={styles.productsGrid}>
              {products.length > 0 ? (
                products.map(produto => (
                  <ProductCard key={produto.id} {...produto} />
                ))
              ) : (
                <div style={{ textAlign: 'center', gridColumn: 'span 3', padding: '20px' }}>
                  <p>Nenhum produto encontrado. Busque por outro termo ou limpe os filtros.</p>
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