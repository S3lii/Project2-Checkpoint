const RAWG_API_KEY = process.env.RAWG_API_KEY || "3b494402afe04a2ca44b845d3af51be9"

async function getPopularGames() {
    try {
        let allGames = []

        for (let i = 1; i <= 4; i++) {
            const response = await fetch(`https://api.rawg.io/api/games?key=${RAWG_API_KEY}&ordering=-added&page_size=40&page=${i}`)
            const data = await response.json()

            if (data.results) {
                data.results.forEach((game) => {
                allGames.push({
                rawgId: game.id , 
                title: game.name , 
                 coverImage: game.background_image , 
                description: ""
                    })
                })
            }
        }

        return allGames
    } catch (error) {
        return []
    }
}

async function searchGames(searchQuery) {
    try {
        const response = await fetch(`https://api.rawg.io/api/games?key=${RAWG_API_KEY}&search=${searchQuery}&page_size=40`)
        const data = await response.json()
        let gamesList = []

        if (data.results) {
            data.results.forEach((game) => {
                gamesList.push({
                    rawgId: game.id , 
                    title: game.name , 
                    coverImage: game.background_image , 
                    description: ""
                })
            })
        }

        return gamesList
    } catch (error) {
        return []
    }
}

module.exports = {
    getPopularGames , 
    searchGames
}