# P.A.M Pollen Alert Map
<img width="1900" height="864" alt="Screenshot 2025-10-10 141202" src="https://github.com/user-attachments/assets/c353b931-52ab-45ad-af21-5a0d9a7ac631" />
<img width="1904" height="865" alt="Screenshot 2025-10-10 145843" src="https://github.com/user-attachments/assets/e6b63e14-a995-4fe2-859f-1f7e4cc1a366" />
<img width="1890" height="818" alt="Screenshot 2025-10-10 145916" src="https://github.com/user-attachments/assets/bfdd8542-af6e-48fb-8166-97a715b5eb11" />

# Overview
P.A.M is a pollen alert map that visualizes pollen forecasts to help individuals suffering from pollen allergies. Research shows that pollen seasons are lengthening due to climate change, increasing allergy risks.

We chose the challenge  [BloomWatch: An Earth Observation Application for Global Flowering Phenology](https://www.spaceappschallenge.org/2025/challenges/bloomwatch-an-earth-observation-application-for-global-flowering-phenology/)
 The challenge highlighted that super blooms can be detected through NASA satellite imagery. From this, we developed the idea of using NASA Earth observation data to track plant bloom patterns that correlate with pollen production and allergen levels.

# Key Features
- Pollen forecast up to 5 days (real time data)
- Heatmap visualization on an interactive map 
- Pollen alerts & health advice for allergy prevention
- Extended pollen forecast up to 12 periods (1 period = 16 days)
- Information on common allergenic pollen types

# Results & Impact
- Covers 65+ countries with data on grass, weed, and tree pollen
- Color-coded intensity map for easy pollen level tracking
- Extended forecast (North America focus) up to 12 periods for better prep
- Pollen info helps users learn what types appear, where, and when

# Tehnical Overview
Data Sources: Google Cloud Pollen API, Google Maps API, NASA MODIS NDVI GeoTIFF (16 day, 250m resolution)  
Processing: JavaScript, Jupyter Notebook (Python), calculation pipeline that combines linear trends, seasonal cycles, and environmental fluctuations    
Visualization: HTML, CSS, JavaScript  

Why NASA MODIS?
- Uses MODIS Vegetation Indices (NDVI) to measure vegetation growth and greenness which are strong indicators of pollen production.
- 16 day, high resolution data enable tracking of seasonal and regional vegetation changes, improving pollen forecast accuracy.

# Team
Team Name : Team Dilly Dally
Members:
Wiktoria Leszczynska - Developer  
Katie Keegan and - Developer  
Mavis Hye Xuan Chia - Devleloper  
Fatma Rhazia - Business Modeler  


# Alignment with nasa challenge
Our solution directly aligns with NASA’s challenge goals by:
- Harnessing NASA Earth Observation data (MODIS NDVI) to detect and visualize plant blooming events.
- Monitoring and predicting bloom cycles across diverse landscapes and seasons.
- Correlating bloom intensity with pollen activity, supporting allergy management and ecological monitoring.
- Providing real world applications for allergy, public health alerts and even climate change impact studies.


# Future Enhancements
- Mobile app version
- ML model using MODIS data since 2000 for better accuracy & climate insights
- User-reported pollen alerts (like Waze)
- Authentication for personalized forecasts
- Browser plugin integration



References
- https://modis.gsfc.nasa.gov/data/dataprod/mod13.php
- https://appeears.earthdatacloud.nasa.gov/
- https://www.niehs.nih.gov/health/topics/agents/pollen
- https://www.pnas.org/doi/10.1073/pnas.2100008118
- https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9041883/
- https://www.ncei.noaa.gov/products/pollen
- https://www.climatecentral.org/news/report-longer-growing-season-longer-allergy-season-2025
- https://www.cbsnews.com/news/allergy-map-2025-us-cities-spring-allergies/
- https://www.perplexity.ai/
- https://chat.openai.com/


