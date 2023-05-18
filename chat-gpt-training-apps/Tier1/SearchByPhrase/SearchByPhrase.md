## Search by phrase in nested attributes

**Category:** This is a sample app. For this particular case, query workers and SEARCH are used for filtering data inside a collection.

## Summary:

The following example demonstrates how to search for attributes in documents contained in a collection. These attributes can be simple or can be nested (one attribute inside another one). 

For this sample, we’re using a collection called `**movies**` which contains attributes like `**title**`, **`main_cast`** and **`description`**, among others.

All attributes are simple, except **`description`**. This attribute contains **`brief`** and `**full**`, nested attributes containing a short and an extensive description of the movie’s plot.

We will use the provided dataset and search view configuration to search for movies based on their title, main cast, and description (both brief and full).

1. Importing the dataset containing movie objects into the **`movies`** collection.
2. Creating a full-text search index.
3. Executing the query worker to search for movies based on the **`title`**, **`main_cast`**, and **`description`** fields, using the PHRASE() function and the "text_en" analyzer to match the search query against the indexed fields.

The input data has the format:

```json
[
  {
    "title": "Example Movie",
    "duration": 120,
    "year": 2020,
    "director": "John Doe",
    "main_cast": ["Actor 1", "Actor 2"],
    "description": {
      "brief": "A brief description of the example movie.",
      "full": "A full description of the example movie."
    }
  }
]
```

## Search Index Definition:

```json
{
  "links": {
    "movies": {
      "analyzers": [
        "text_en"
      ],
      "fields": {
        "title": {},
        "main_cast": {},
        "description": {
          "fields": {
            "brief": {},
            "full": {}
          }
        }
      },
      "includeAllFields": false,
      "storeValues": "none",
      "trackListPositions": false
    }
  },
  "name": "movies_view",
  "primarySort": [
    {
      "field": "title",
      "asc": false
    }
  ],
  "type": "search"
}
```

## Code:

```sql
FOR movie IN movies_view
  SEARCH ANALYZER(
    PHRASE(movie.title, @query, "text_en") OR
    PHRASE(movie.main_cast, @query, "text_en") OR
    PHRASE(movie.description.brief, @query, "text_en") OR
    PHRASE(movie.description.full, @query, "text_en"),
    "text_en"
  )
  SORT BM25(movie) DESC
  RETURN movie
```

## Input data:

```json
[
  {
    "title": "Iron Man",
    "duration": 126,
    "year": 2008,
    "director": "Jon Favreau",
    "main_cast": ["Robert Downey Jr.", "Terrence Howard", "Gwyneth Paltrow", "Jeff Bridges"],
    "description": {
      "brief": "A wealthy inventor named Tony Stark creates a powerful suit of armor to fight against his enemies after being kidnapped.",
      "full": "After being kidnapped and held captive by terrorists, billionaire industrialist Tony Stark creates a technologically advanced suit of armor that allows him to become the superhero known as Iron Man. As he adjusts to his new role as a crime-fighter and protector, he must also confront the ghosts of his past and the powerful enemies that arise as a result of his newfound powers."
    }
  },
    {
    "title": "Star Wars: Episode IV - A New Hope",
    "duration": 121,
    "year": 1977,
    "director": "George Lucas",
    "main_cast": ["Mark Hamill", "Harrison Ford", "Carrie Fisher", "Alec Guinness"],
    "description": {
      "brief": "A young farm boy named Luke Skywalker joins a group of rebels in their quest to destroy the evil Empire's Death Star.",
      "full": "In a distant galaxy, the Empire, led by the sinister Darth Vader, threatens to crush the rebellion against their rule. When young farm boy Luke Skywalker discovers a hidden message within the droid R2-D2, he is thrust into an adventure that will change his life forever. Alongside Princess Leia, Han Solo, and the wise Jedi Knight Obi-Wan Kenobi, Luke must use the power of the Force to destroy the Death Star and restore freedom to the galaxy."
    }
  },
  {
    "title": "Casino Royale",
    "duration": 144,
    "year": 2006,
    "director": "Martin Campbell",
    "main_cast": ["Daniel Craig", "Eva Green", "Mads Mikkelsen", "Judi Dench"],
    "description": {
      "brief": "Newly appointed 007, James Bond, must stop a dangerous financier from winning a high-stakes poker game and using the funds to finance terrorism.",
      "full": "In his first mission as 007, James Bond is tasked with stopping Le Chiffre, a notorious banker to the world's terrorists, from winning a high-stakes poker game in Montenegro. As Bond investigates the enigmatic Le Chiffre, he is joined by the beautiful and resourceful Vesper Lynd, a British Treasury agent. Together, they navigate a world of danger and deception, ultimately leading to a high-stakes showdown that will determine the fate of international terrorism."
    }
  },
  {
    "title": "Black Panther",
    "duration": 134,
    "year": 2018,
    "director": "Ryan Coogler",
    "main_cast": ["Chadwick Boseman", "Michael B. Jordan", "Lupita Nyong'o", "Danai Gurira"],
      "description": {
        "brief": "After the death of his father, T'Challa returns to Wakanda to take his place as king, only to face a powerful enemy who threatens his kingdom.",
        "full": "When T'Challa's father, the king of the technologically advanced African nation of Wakanda, dies, T'Challa must take his place on the throne. As the new king, T'Challa must confront the long-buried secrets of his family's past and defend his kingdom from a powerful enemy, Erik Killmonger. As the Black Panther, TT'Challa is faced with difficult choices that will not only determine the fate of his people but also the entire world."
    }
  },
  {
    "title": "Star Wars: Episode V - The Empire Strikes Back",
    "duration": 124,
    "year": 1980,
    "director": "Irvin Kershner",
    "main_cast": ["Mark Hamill", "Harrison Ford", "Carrie Fisher", "Billy Dee Williams"],
    "description": {
      "brief": "As the Empire hunts down the Rebel Alliance, Luke Skywalker begins his Jedi training with Yoda while his friends are pursued by Darth Vader.",
      "full": "Following the destruction of the Death Star, the Rebel Alliance is on the run from the relentless Empire. Luke Skywalker embarks on a journey to the remote planet of Dagobah to train under the tutelage of the wise Jedi Master Yoda. Meanwhile, Han Solo, Princess Leia, and their companions are pursued by the sinister Darth Vader and his Imperial forces. As the struggle between the dark and light sides of the Force intensifies, the fate of the galaxy hangs in the balance."
    }
  },
  {
    "title": "Skyfall",
    "duration": 143,
    "year": 2012,
    "director": "Sam Mendes",
    "main_cast": ["Daniel Craig", "Javier Bardem", "Naomie Harris", "Judi Dench"],
    "description": {
      "brief": "When a mysterious figure from M's past threatens MI6, James Bond must track down the threat and protect his agency from destruction.",
      "full": "After a mission goes awry, James Bond finds himself in the crosshairs of a former MI6 operative turned cyberterrorist, Raoul Silva. As Silva orchestrates a series of attacks against MI6 and its personnel, Bond must confront his own past and protect M, the head of the agency. As the stakes rise and the situation becomes increasingly desperate, Bond must use every resource at his disposal to protect those he cares about and ensure the safety of the British intelligence community."
    }
  },
  {
    "title": "Thor: Ragnarok",
    "duration": 130,
    "year": 2017,
    "director": "Taika Waititi",
    "main_cast": ["Chris Hemsworth", "Tom Hiddleston", "Cate Blanchett", "Mark Ruffalo"],
    "description": {
      "brief": "Thor is imprisoned on the other side of the universe and must race against time to prevent the destruction of his home world, Asgard.",
      "full": "When Thor, the god of thunder, is imprisoned by the ruthless Hela, he finds himself in a deadly gladiatorial contest against his former ally, the Hulk. Together with a ragtag group of warriors, Thor must race against time to return to Asgard and stop Hela from unleashing the cataclysmic event known as Ragnarok. As Thor battles to save his people and his world, he discovers the true nature of his own power and the importance of family and friendship."
    }
  },
  {
    "title": "The Avengers",
    "duration": 143,
    "year": 2012,
    "director": "Joss Whedon",
    "main_cast": ["Robert Downey Jr.", "Chris Evans", "Mark Ruffalo", "Chris Hemsworth"],
    "description": {
      "brief": "When an unexpected enemy threatens global safety and security, Nick Fury, director of the international peacekeeping agency known as S.H.I.E.L.D., assembles a team of superheroes known as The Avengers to save the world from disaster.",
      "full": "When an unexpected threat emerges that puts the entire world in danger, Nick Fury, the director of S.H.I.E.L.D., assembles a team of superheroes to save the planet. Iron Man, Captain America, Thor, the Hulk, Black Widow, and Hawkeye join forces to battle the villainous Loki and his army of alien invaders. As the fate of the world hangs in the balance, the Avengers must overcome their differences and work together to save humanity from destruction."
    }
  },
  {
    "title": "Captain America: The Winter Soldier",
    "duration": 136,
    "year": 2014,
    "director": "Anthony Russo, Joe Russo",
    "main_cast": ["Chris Evans", "Scarlett Johansson", "Sebastian Stan", "Anthony Mackie"],
    "description": {
      "brief": "As Steve Rogers adjusts to life in the modern world, he must team up with fellow Avenger Natasha Romanoff, aka Black Widow, to stop a dangerous conspiracy that threatens the world.",
      "full": "After the events of The Avengers, Steve Rogers, aka Captain America, is adjusting to life in the modern world. When a fellow S.H.I.E.L.D. agent is attacked, Rogers teams up with Natasha Romanoff, aka Black Widow, to uncover a conspiracy that goes all the way to the top of the organization. As they race against time to stop a dangerous plot that threatens the world, Rogers and Romanoff must also confront their own pasts and the challenges of being superheroes in a complex and changing world."
    }
  },
  {
    "title": "Star Wars: Episode VI - Return of the Jedi",
    "duration": 131,
    "year": 1983,
    "director": "Richard Marquand",
    "main_cast": ["Mark Hamill", "Harrison Ford", "Carrie Fisher", "Billy Dee Williams"],
    "description": {
      "brief": "As the Rebel Alliance prepares for a final showdown with the Empire, Luke Skywalker must face Darth Vader in a climactic lightsaber battle.",
      "full": "As the Rebel Alliance prepares for a final showdown with the Empire, Luke Skywalker must confront Darth Vader in a climactic lightsaber battle that will determine the fate of the galaxy. Meanwhile, Han Solo and Princess Leia lead a team of rebels on a dangerous mission to destroy the new Death Star and end the Empire's reign of terror once and for all. With the help of the Ewoks and other allies, the Rebel Alliance mounts a daring assault on the Imperial stronghold, leading to an epic final battle that will change the course of history."
    }
  }
]
```

## Detailed Explanation:

1. **Create the search view:**
The code starts by creating a search view named 'movies_view' and configuring it to index the specified fields for searching. The fields include 'title', 'main_cast', and 'description' (both 'brief' and 'full').
    
To do this, we must create a new search view through the UI’s API reference. We need the endpoint **`/fabric/{fabric}/_api/search/view`**.
    
From there we click the “Try it out” button, write the correct fabric where we want the search view (**`_system`** by default) and then paste the configuration for the search view and click “Execute”.
    
```json
{
  "links": {
    "movies": {
      "analyzers": [
        "text_en"
      ],
      "fields": {
      "title": {},
      "main_cast": {},
      "description": {
        "fields": {
          "brief": {},
          "full": {}
          }
        }
      },
    "includeAllFields": false,
    "storeValues": "none",
    "trackListPositions": false
    }
  },
  "name": "movies_view",
  "primarySort": [
    {
      "field": "title",
      "asc": false
    }
  ],
  "type": "search"
}
```
    
After that we can verify the view by going to the “Search views” options on the UI’s main menu and see that the **`movies_view`** search view has been created.
    
2. **Import the dataset:**
The dataset containing movie objects is imported into the 'movies' collection. Each movie object contains information about the title, duration, year, director, main_cast, and description (both brief and full).
    
```json
[
  {
    "title": "Iron Man",
    "duration": 126,
    "year": 2008,
    "director": "Jon Favreau",
    "main_cast": ["Robert Downey Jr.", "Terrence Howard", "Gwyneth Paltrow", "Jeff Bridges"],
    "description": {
      "brief": "A wealthy inventor named Tony Stark creates a powerful suit of armor to fight against his enemies after being kidnapped.",
      "full": "After being kidnapped and held captive by terrorists, billionaire industrialist Tony Stark creates a technologically advanced suit of armor that allows him to become the superhero known as Iron Man. As he adjusts to his new role as a crime-fighter and protector, he must also confront the ghosts of his past and the powerful enemies that arise as a result of his newfound powers."
    }
  },
  {
    "title": "Star Wars: Episode IV - A New Hope",
    "duration": 121,
    "year": 1977,
    "director": "George Lucas",
    "main_cast": ["Mark Hamill", "Harrison Ford", "Carrie Fisher", "Alec Guinness"],
    "description": {
      "brief": "A young farm boy named Luke Skywalker joins a group of rebels in their quest to destroy the evil Empire's Death Star.",
      "full": "In a distant galaxy, the Empire, led by the sinister Darth Vader, threatens to crush the rebellion against their rule. When young farm boy Luke Skywalker discovers a hidden message within the droid R2-D2, he is thrust into an adventure that will change his life forever. Alongside Princess Leia, Han Solo, and the wise Jedi Knight Obi-Wan Kenobi, Luke must use the power of the Force to destroy the Death Star and restore freedom to the galaxy."
    }
  },
  {
    "title": "Casino Royale",
    "duration": 144,
    "year": 2006,
    "director": "Martin Campbell",
    "main_cast": ["Daniel Craig", "Eva Green", "Mads Mikkelsen", "Judi Dench"],
    "description": {
      "brief": "Newly appointed 007, James Bond, must stop a dangerous financier from winning a high-stakes poker game and using the funds to finance terrorism.",
      "full": "In his first mission as 007, James Bond is tasked with stopping Le Chiffre, a notorious banker to the world's terrorists, from winning a high-stakes poker game in Montenegro. As Bond investigates the enigmatic Le Chiffre, he is joined by the beautiful and resourceful Vesper Lynd, a British Treasury agent. Together, they navigate a world of danger and deception, ultimately leading to a high-stakes showdown that will determine the fate of international terrorism."
    }
  },
  {
    "title": "Black Panther",
    "duration": 134,
    "year": 2018,
    "director": "Ryan Coogler",
    "main_cast": ["Chadwick Boseman", "Michael B. Jordan", "Lupita Nyong'o", "Danai Gurira"],
    "description": {
      "brief": "After the death of his father, T'Challa returns to Wakanda to take his place as king, only to face a powerful enemy who threatens his kingdom.",
      "full": "When T'Challa's father, the king of the technologically advanced African nation of Wakanda, dies, T'Challa must take his place on the throne. As the new king, T'Challa must confront the long-buried secrets of his family's past and defend his kingdom from a powerful enemy, Erik Killmonger. As the Black Panther, TT'Challa is faced with difficult choices that will not only determine the fate of his people but also the entire world."
    }
  },
  {
    "title": "Star Wars: Episode V - The Empire Strikes Back",
    "duration": 124,
    "year": 1980,
    "director": "Irvin Kershner",
    "main_cast": ["Mark Hamill", "Harrison Ford", "Carrie Fisher", "Billy Dee Williams"],
    "description": {
      "brief": "As the Empire hunts down the Rebel Alliance, Luke Skywalker begins his Jedi training with Yoda while his friends are pursued by Darth Vader.",
      "full": "Following the destruction of the Death Star, the Rebel Alliance is on the run from the relentless Empire. Luke Skywalker embarks on a journey to the remote planet of Dagobah to train under the tutelage of the wise Jedi Master Yoda. Meanwhile, Han Solo, Princess Leia, and their companions are pursued by the sinister Darth Vader and his Imperial forces. As the struggle between the dark and light sides of the Force intensifies, the fate of the galaxy hangs in the balance."
    }
  },
  {
    "title": "Skyfall",
    "duration": 143,
    "year": 2012,
    "director": "Sam Mendes",
    "main_cast": ["Daniel Craig", "Javier Bardem", "Naomie Harris", "Judi Dench"],
    "description": {
      "brief": "When a mysterious figure from M's past threatens MI6, James Bond must track down the threat and protect his agency from destruction.",
      "full": "After a mission goes awry, James Bond finds himself in the crosshairs of a former MI6 operative turned cyberterrorist, Raoul Silva. As Silva orchestrates a series of attacks against MI6 and its personnel, Bond must confront his own past and protect M, the head of the agency. As the stakes rise and the situation becomes increasingly desperate, Bond must use every resource at his disposal to protect those he cares about and ensure the safety of the British intelligence community."
    }
  },
  {
    "title": "Thor: Ragnarok",
    "duration": 130,
    "year": 2017,
    "director": "Taika Waititi",
    "main_cast": ["Chris Hemsworth", "Tom Hiddleston", "Cate Blanchett", "Mark Ruffalo"],
    "description": {
      "brief": "Thor is imprisoned on the other side of the universe and must race against time to prevent the destruction of his home world, Asgard.",
      "full": "When Thor, the god of thunder, is imprisoned by the ruthless Hela, he finds himself in a deadly gladiatorial contest against his former ally, the Hulk. Together with a ragtag group of warriors, Thor must race against time to return to Asgard and stop Hela from unleashing the cataclysmic event known as Ragnarok. As Thor battles to save his people and his world, he discovers the true nature of his own power and the importance of family and friendship."
    }
  },
  {
    "title": "The Avengers",
    "duration": 143,
    "year": 2012,
    "director": "Joss Whedon",
    "main_cast": ["Robert Downey Jr.", "Chris Evans", "Mark Ruffalo", "Chris Hemsworth"],
    "description": {
      "brief": "When an unexpected enemy threatens global safety and security, Nick Fury, director of the international peacekeeping agency known as S.H.I.E.L.D., assembles a team of superheroes known as The Avengers to save the world from disaster.",
      "full": "When an unexpected threat emerges that puts the entire world in danger, Nick Fury, the director of S.H.I.E.L.D., assembles a team of superheroes to save the planet. Iron Man, Captain America, Thor, the Hulk, Black Widow, and Hawkeye join forces to battle the villainous Loki and his army of alien invaders. As the fate of the world hangs in the balance, the Avengers must overcome their differences and work together to save humanity from destruction."
    }
  },
  {
    "title": "Captain America: The Winter Soldier",
    "duration": 136,
    "year": 2014,
    "director": "Anthony Russo, Joe Russo",
    "main_cast": ["Chris Evans", "Scarlett Johansson", "Sebastian Stan", "Anthony Mackie"],
    "description": {
      "brief": "As Steve Rogers adjusts to life in the modern world, he must team up with fellow Avenger Natasha Romanoff, aka Black Widow, to stop a dangerous conspiracy that threatens the world.",
     "full": "After the events of The Avengers, Steve Rogers, aka Captain America, is adjusting to life in the modern world. When a fellow S.H.I.E.L.D. agent is attacked, Rogers teams up with Natasha Romanoff, aka Black Widow, to uncover a conspiracy that goes all the way to the top of the organization. As they race against time to stop a dangerous plot that threatens the world, Rogers and Romanoff must also confront their own pasts and the challenges of being superheroes in a complex and changing world."
    }
  },
  {
    "title": "Star Wars: Episode VI - Return of the Jedi",
    "duration": 131,
    "year": 1983,
    "director": "Richard Marquand",
    "main_cast": ["Mark Hamill", "Harrison Ford", "Carrie Fisher", "Billy Dee Williams"],
    "description": {
      "brief": "As the Rebel Alliance prepares for a final showdown with the Empire, Luke Skywalker must face Darth Vader in a climactic lightsaber battle.",
      "full": "As the Rebel Alliance prepares for a final showdown with the Empire, Luke Skywalker must confront Darth Vader in a climactic lightsaber battle that will determine the fate of the galaxy. Meanwhile, Han Solo and Princess Leia lead a team of rebels on a dangerous mission to destroy the new Death Star and end the Empire's reign of terror once and for all. With the help of the Ewoks and other allies, the Rebel Alliance mounts a daring assault on the Imperial stronghold, leading to an epic final battle that will change the course of history."
    }
  }
]
```
    
3. **Execute the C8QL query:**
A query worker is executed to search for movies based on the title, main_cast, or description fields. The PHRASE() function and the "text_en" analyzer are used to match the search query against the indexed fields.
    
```sql
FOR movie IN movies_view
SEARCH ANALYZER(
    PHRASE(movie.title, @query, "text_en") OR
    PHRASE(movie.main_cast, @query, "text_en") OR
    PHRASE(movie.description.brief, @query, "text_en") OR
    PHRASE(movie.description.full, @query, "text_en"),
    "text_en"
)
SORT BM25(movie) DESC
RETURN movie
```
    
The query searches for movies based on the input search query (@query) in the title, main_cast, and description (both brief and full) fields. The results are sorted by relevance using the BM25() function. The returned result contains all the attributes for the movies that matched the search term.