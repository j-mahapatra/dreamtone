def get_prompt_generator_prompt(user_prompt: str):
    return f"""
        Reformat the following user-provided music description int oa single comma-separated list of audio tags.

        User description: "{user_prompt}"

        Follow these guidelines strictly when reformatting. Include a tag from each category below in your final list:
        - Include genre (e.g., "rap", "pop", "rock", "electronic")
        - Include vocal type (e.g., "male vocal", "female vocal", "spoken word")
        - Include instruments actually heard (e.g., "guitar", "piano", "drums", "synthesizer")
        - Include mood/energy (e.g., "energetic", "calm", "aggressive", "melancholic")
        - Include key signature if known (e.g., "major key", "minor key", "C major")
        - Include temp if known (e.g., "120 BPM", "fast tempo", "slow tempo")
        - The output must be a single line of comma-separated tags. Do not add any other text or explanation. For example: melodic techno, male vocal, electronic, energetic, 120BPM

        If there are a few tags, infer what the user wants and add 2-3 more tags that are synonyms to the user tags without any new categories.

        Formatted Tags:
    """


def get_lyrics_generator_prompt(description: str):
    return f"""
        Generate song lyrics based on the following description:

        The lyrics should be suitable for a song and structured clearly.
        Use tags like [verse], [chorus], [bridge], [intro] and [outro] to indicate different sections of the song.

        Here is an example:
        "[verse]\nWoke up to the sunrise glow\nTook my heart and hit the road\nWheels hummin' the only tune I know\nStraight to where the wildflowers grow\n\n[verse]\nGot that old map all wrinkled and torn\nDestination unknown but I'm reborn\nWith a smile that the wind has worn\nChasin' dreams that can't be sworn\n\n[chorus]\nRidin' on a highway to sunshine\nGot my shades and my radio on fine\nLeave the shadows in the rearview rhyme\nHeart's racing as we chase the time\n\n[verse]\nMet a girl with a heart of gold\nTold stories that never get old\nHer laugh like a tale that's been told\nA melody so bold yet uncontrolled\n\n[bridge]\nClouds roll by like silent ghosts\nAs we drive along the coast\nWe toast to the days we love the most\nFreedom's song is what we post\n\n[chorus]\nRidin' on a highway to sunshine\nGot my shades and my radio on fine\nLeave the shadows in the rearview rhyme\nHeart's racing as we chase the time"

        Description: "{description}"

        Lyrics:
    """


def get_category_generator_prompt(description: str):
    return f"Based on the following music description, list 3-5 relevant genres or categories as a comma-separated list. For example: Pop, Electronic, Sad, 80s. Description: {description}"
