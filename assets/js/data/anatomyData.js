/**
 * Anatomical data for the respiratory system
 */

export const anatomyData = {
    nose: {
        title: "Nose",
        description: "The nose is the primary entrance for air into the respiratory system. The hairs inside the nose help filter out large particles from the air we breathe. The nasal cavity also warms and humidifies incoming air.",
        funFact: "Your nose can remember 50,000 different scents!",
        functions: [
            "Filters particles from incoming air",
            "Warms and humidifies air",
            "Houses olfactory receptors for smell",
            "Produces mucus to trap pathogens"
        ],
        medicalNote: "Blocked nasal passages can reduce oxygen intake and affect sleep quality."
    },
    
    pharynx: {
        title: "Pharynx (Throat)",
        description: "The pharynx is a muscular tube that serves as a passageway for both air and food. It connects the nasal cavity and mouth to the larynx and esophagus. This shared pathway requires careful coordination during swallowing.",
        funFact: "The pharynx plays a role in both respiration and digestion, making it a critical crossroads in your body.",
        functions: [
            "Conducts air from nose/mouth to larynx",
            "Provides pathway for food to esophagus",
            "Houses tonsils for immune defense",
            "Assists in speech production"
        ],
        medicalNote: "Pharyngeal infections can affect both breathing and swallowing."
    },
    
    larynx: {
        title: "Larynx (Voice Box)",
        description: "The larynx contains the vocal cords and is responsible for sound production. It also prevents food from entering the lower respiratory tract through the epiglottis mechanism.",
        funFact: "Men typically have larger larynxes, which is why they usually have deeper voices.",
        functions: [
            "Houses vocal cords for speech",
            "Prevents aspiration during swallowing",
            "Regulates airflow to lungs",
            "Protects lower airways"
        ],
        medicalNote: "Laryngeal swelling can cause breathing difficulties and voice changes."
    },
    
    trachea: {
        title: "Trachea (Windpipe)",
        description: "The trachea is a tube about 4-5 inches long and 1 inch in diameter that carries air to the bronchi. It's reinforced with C-shaped cartilage rings to keep it open and prevent collapse during breathing.",
        funFact: "The trachea can expand up to 3 times its normal size when you take a deep breath!",
        functions: [
            "Conducts air between larynx and bronchi",
            "Maintains open airway with cartilage support",
            "Filters and cleans incoming air",
            "Produces mucus to trap particles"
        ],
        medicalNote: "Tracheal obstruction is a medical emergency requiring immediate intervention."
    },
    
    lungs: {
        title: "Lungs",
        description: "The lungs are paired, cone-shaped organs that take up most of the space in the chest. The right lung has 3 lobes while the left has 2 to make room for the heart. They contain millions of alveoli for gas exchange.",
        funFact: "If you stretched out all the airways in your lungs, they would cover about 70 square meters - about the size of a tennis court!",
        functions: [
            "Primary site of gas exchange",
            "Filters blood clots and air bubbles",
            "Produces surfactant to reduce surface tension",
            "Helps regulate blood pH"
        ],
        medicalNote: "Lung capacity decreases with age and can be improved with regular exercise."
    },
    
    bronchi: {
        title: "Bronchi",
        description: "The bronchi are the two main branches of the trachea that lead to the lungs. They further divide into smaller bronchioles, creating a tree-like structure that distributes air throughout the lungs.",
        funFact: "The right bronchus is wider, shorter, and more vertical than the left, which is why foreign objects are more likely to enter the right lung.",
        functions: [
            "Distribute air to different lung regions",
            "Filter and warm incoming air",
            "Produce mucus for particle trapping",
            "Provide structural support to lungs"
        ],
        medicalNote: "Bronchial inflammation (bronchitis) can cause persistent coughing and breathing difficulties."
    },
    
    bronchioles: {
        title: "Bronchioles",
        description: "Bronchioles are small airways that branch off from the bronchi and lead to the alveoli. They can constrict or dilate to control airflow and are the site where asthma primarily affects breathing.",
        funFact: "There are about 30,000 bronchioles in each lung!",
        functions: [
            "Control airflow to alveoli",
            "Regulate ventilation distribution",
            "Contain smooth muscle for diameter control",
            "Final air conditioning before alveoli"
        ],
        medicalNote: "Bronchiole constriction during asthma attacks can severely limit breathing."
    },
    
    alveoli: {
        title: "Alveoli",
        description: "Alveoli are tiny air sacs where gas exchange occurs. Oxygen diffuses into the blood while carbon dioxide diffuses out. They are surrounded by capillaries and have extremely thin walls for efficient gas transfer.",
        funFact: "There are about 480 million alveoli in adult lungs - that's about the same number as stars in the Milky Way galaxy!",
        functions: [
            "Site of oxygen and carbon dioxide exchange",
            "Provide massive surface area for gas transfer",
            "Produce surfactant to prevent collapse",
            "Interface between respiratory and circulatory systems"
        ],
        medicalNote: "Alveolar damage from smoking or disease can permanently reduce lung function."
    },
    
    diaphragm: {
        title: "Diaphragm",
        description: "The diaphragm is a dome-shaped muscle that separates the chest from the abdomen. Its contraction and relaxation drive the breathing process by changing the volume of the chest cavity.",
        funFact: "The diaphragm is the primary muscle used in breathing and accounts for 75% of the air movement in normal breathing.",
        functions: [
            "Primary muscle of inspiration",
            "Creates negative pressure for air intake",
            "Separates chest and abdominal cavities",
            "Assists in other functions like coughing"
        ],
        medicalNote: "Diaphragm paralysis can severely impair breathing and may require mechanical ventilation."
    }
};

/**
 * Get anatomy information by part name
 * @param {string} partName - Name of the anatomical part
 * @returns {Object|null} Anatomy data or null if not found
 */
export function getAnatomyInfo(partName) {
    return anatomyData[partName] || null;
}

/**
 * Get all anatomy parts
 * @returns {Array} Array of part names
 */
export function getAllAnatomyParts() {
    return Object.keys(anatomyData);
}

/**
 * Search anatomy data by keyword
 * @param {string} keyword - Search term
 * @returns {Array} Array of matching parts
 */
export function searchAnatomyData(keyword) {
    const results = [];
    const searchTerm = keyword.toLowerCase();
    
    Object.entries(anatomyData).forEach(([partName, data]) => {
        if (
            data.title.toLowerCase().includes(searchTerm) ||
            data.description.toLowerCase().includes(searchTerm) ||
            data.functions.some(func => func.toLowerCase().includes(searchTerm))
        ) {
            results.push({ name: partName, ...data });
        }
    });
    
    return results;
}