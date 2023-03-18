import {useState, useEffect} from 'react'
import { useQuery } from '@tanstack/react-query'
import useDebounce from '../hooks/useDebounce'
import { Flex, Spacer } from '@chakra-ui/react'

export default function Search(){

    const [titikAwal, setTitikAwal] = useState('')
    const [tujuan, setTujuan] = useState('')
    const [search, setSearch] = useState('')
    const [filteredData, setFilteredData] = useState([])
    const debouncedSearchTerm = useDebounce(search, 1000)
    
    const [ruteAwal, setRuteAwal] = useState([])
    const [buatRute, setBuatRute] = useState([])
    const [halteTransit, setHalteTransit] = useState([])


    

    const {data, isLoading, error} = useQuery({
      queryKey: ['data_halte'],
      queryFn: () => {
          return fetch(`https://raw.githubusercontent.com/Andrewfpai/bsd-link-library/main/bsd-link.json`)
            .then(res => res.json())
      },
        })

        // untuk filter search bar
        useEffect(() => {
          const filtered = data?.nama_halte?.filter(item => {
            if (debouncedSearchTerm === '') {
              return item;
            } else {
          
              return item?.toLowerCase()?.includes(debouncedSearchTerm.toLowerCase());
            }
          });
   
          setFilteredData(filtered || []);
        }, [data, debouncedSearchTerm]);
        

        //Untuk Nentuin titik Awal ada di rute mana aja --> hasil = [0,1,2]
        useEffect(() => {
          setRuteAwal([]) // Refresh isi dari rute Awal setiap kali user pilih tujuan baru
        
          // rute itu object dari semua-rute
          data?.semua_rute?.forEach((rute,index) => {   // halte disini artinya item di dalam array [1,2,3], berarti 1 object
       
            for (let key in rute.halte) { 
              const halteTanpa_ = key.replace(/_/g, " ");              //akses bject "halte" di dalam array "semua_rute"
              
              if (titikAwal===halteTanpa_){
                setRuteAwal(ruteAwal => [...ruteAwal, index]);    //masukkin rutenya yang sesuai dengan titik awal
              }

            }
          });  
        }, [data, titikAwal]);


        //Untuk buat rute dari titik awal ke tujuan --> hasil = ["titikAwal", "halte2 lain", "Tujuan"]
        useEffect(() => {
          setBuatRute([])
          
          
          
          let done = false;
          

          for (let i = ruteAwal[0]; i < ruteAwal?.length+1; i++) {

            let defaultState = false;

            for (let key in data?.semua_rute[i]?.halte) { 
              const halteTanpa_ = key.replace(/_/g, " ");
              
              if ((halteTanpa_=== titikAwal && tujuan) || defaultState){ //Kalo belum sesuai titik awal jangan dibuat rutenya dulu, tapi kalo udah lewat boleh, mencegah kebuat rute yang berbalik arus
                console.log("TES",halteTanpa_)
                defaultState = true
                
                setBuatRute(buatRute => [...buatRute, key])
                
                if (!done && (Object.keys(data?.semua_rute[i].halte)[Object.keys(data?.semua_rute[i].halte).length-1]) === key){
                  console.log("=====",halteTanpa_)
                  setBuatRute([])
                }


                if(halteTanpa_ === tujuan){
                  
                  done=true
                  break;
                }
              }
            }
            if (done){break}
          }
          
          
        }, [tujuan, titikAwal]);


        //Untuk buat rute transit
        useEffect(() => {

          setHalteTransit([]) // selalu reset ketika titik awal dan tujuan berubah

          for (let i = ruteAwal[0]; i < ruteAwal?.length+1; i++) { //ga tulis i=0 karena index pertama ga selalu 0, bisa aja 1 atau 2
            let defaultState = false;
            
            for (let key in data.semua_rute[i].halte) { 
              const halteTanpa_ = key.replace(/_/g, " "); //filter key object untuk hilangin _

              if ((halteTanpa_=== titikAwal && tujuan) || (defaultState)){ //Kalo belum sesuai titik awal jangan dibuat rutenya dulu, tapi kalo udah lewat boleh, mencegah kebuat rute yang berbalik arus
                defaultState = true

              if (data?.halte_transit.includes(halteTanpa_)){ //jika ada halte yang termasuk di dalam array halte transit, masukkin ke array

                setHalteTransit(halteTransit => [...halteTransit, halteTanpa_]);

                if (Object.keys(data?.semua_rute[i].halte)[Object.keys(data?.semua_rute[i].halte).length-1] === key){ //jika halte sama dengan halte di key object terakhir, kasih --- (nunjukkin perbedaan halte transit setiap rute)
                  setHalteTransit(halteTransit => [...halteTransit, "---"]);
                }
             
               
              }

              
              if(halteTanpa_ === tujuan){
            
                break; //jika udah ketemu tujuan, selesai loopingnya
              }}
                
            }}
          
        }, [titikAwal, tujuan]);

        
  
    if (isLoading) return 'Loading...'
  
    if (error) return 'An error has occurred: ' + error.message

    

  return (
    <div className="Search">
      <Flex gap="20">
        <div className="titikAwal">
          <input
            name="search"
            value={search}
            onChange={(e) => {setSearch(e.target.value);}}
            />
          {filteredData?.map((item, index) => 
            <p onClick={()=>{setTitikAwal(item)}} key={index}>{item}</p>
          )}
        </div>
        
        {/* titikAwalnya dapet, cuma perlu delay gabisa langsung diambil */}
        {console.log(titikAwal,"=",ruteAwal)} 
        {console.log("rute jadi","=",buatRute)} 
        {console.log("halte transit","=",halteTransit)} 

        <div className="tujuan">
          <input
            name="search"
            value={search}
            onChange={(e) => {setSearch(e.target.value);}}
            />
          {filteredData?.map((item, index) => 
            <p onClick={()=>{setTujuan(item)}} key={index}>{item}</p>
          )}
        </div>

        <p>{titikAwal}</p>
       
        <p>{tujuan}</p>
      
      </Flex>

      

    </div>
  );
}







