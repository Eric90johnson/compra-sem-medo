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

  // --- ESTRATÉGIA BLINDADA: DADOS MOCKADOS ---
  // DICA DE OURO: Para colocar seus produtos reais, vá no site do Mercado Livre, 
  // clique com o botão direito na foto do produto, escolha "Copiar endereço da imagem"
  // e cole aqui no campo "image". Faça o mesmo com o seu link de afiliado no campo "permalink".
  const mockProducts = [
    {
      id: 'MLB1',
      title: 'Smartphone Samsung Galaxy S23 5G 256GB Preto',
      image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&q=80', 
      originalPrice: 4500.00,
      price: 3799.00,
      discount: 15,
      storeName: 'Samsung',
      permalink: 'https://www.mercadolivre.com.br/' // Cole seu link de afiliado aqui!
    },
    {
      id: 'MLB2',
      title: 'Smart TV 55 Polegadas 4K UHD',
      image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&q=80',
      originalPrice: 3200.00,
      price: 2499.00,
      discount: 21,
      storeName: 'Loja Oficial',
      permalink: 'https://www.mercadolivre.com.br/'
    },
    {
      id: 'MLB3',
      title: 'Notebook Ideapad AMD Ryzen 5 8GB',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80',
      originalPrice: 2800.00,
      price: 2199.00,
      discount: 21,
      storeName: 'Loja Oficial',
      permalink: 'https://www.mercadolivre.com.br/'
    },
    {
      id: 'MLB4',
      title: 'Console Console 5 825GB Branco',
      image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&q=80',
      originalPrice: 4499.00,
      price: 3999.00,
      discount: 11,
      storeName: 'Loja Oficial',
      permalink: 'https://www.mercadolivre.com.br/'
    },
    {
      id: 'MLB5',
      title: 'Fritadeira Air Fryer 4L Inox',
      image: 'https://images.unsplash.com/photo-1626200419188-f142b99a4413?w=500&q=80',
      originalPrice: 499.00,
      price: 349.00,
      discount: 30,
      storeName: 'Loja Oficial',
      permalink: 'https://www.mercadolivre.com.br/'
    },
    {
      id: 'MLB6',
      title: 'Fone de Ouvido Bluetooth Sem Fio',
      image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&q=80',
      originalPrice: 299.00,
      price: 219.00,
      discount: 26,
      storeName: 'Loja Oficial',
      permalink: 'https://www.mercadolivre.com.br/'
    }
  ];

  async function fetchProducts() {
    setLoading(true);
    setTimeout(() => {
      setProducts(mockProducts);
      setCurrentPage(1);
      setLoading(false);
    }, 800); // 0.8 segundos de carregamento para dar uma sensação premium
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  const indexOfLastProduct = Math.max(currentPage * itemsPerPage, 0);
  const indexOfFirstProduct = Math.max(indexOfLastProduct - itemsPerPage, 0);
  const displayedProducts = Array.isArray(products) ? products.slice(indexOfFirstProduct, indexOfLastProduct) : [];

  const totalPages = itemsPerPage > 0 ? Math.ceil(products.length / itemsPerPage) : 0;

  return (
    <div className={styles.pageContainer}>
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