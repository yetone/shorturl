"""
VerseCraft Poem Generator Module

Generates poems relevant to the URL shortening product domain.
Poems contain references to links, URLs, analytics, tracking, and connectivity concepts.
"""

import random
from typing import List, Optional


# Domain keywords for URL/link shortening concepts
URL_LINK_KEYWORDS = [
    "url", "link", "short", "shorten", "tiny", "compact", "redirect",
    "path", "destination", "address", "web", "http", "href", "bookmark"
]

# Domain keywords for analytics/tracking concepts
ANALYTICS_TRACKING_KEYWORDS = [
    "analytics", "track", "click", "count", "measure", "metrics", "stats",
    "statistics", "data", "insight", "monitor", "view", "visit", "traffic"
]

# Domain keywords for connectivity/sharing concepts
CONNECTIVITY_SHARING_KEYWORDS = [
    "connect", "share", "spread", "reach", "network", "social", "viral",
    "deliver", "bridge", "unite", "journey", "travel", "flow", "stream"
]

# Pre-crafted poem templates that incorporate domain keywords
POEM_TEMPLATES = [
    """In the realm of endless links so long,
VerseCraft sings its shortening song.
Each URL transformed with care,
A tiny path through digital air.

Clicks are counted, journeys tracked,
Every visit, every fact.
From referrer to destination's door,
Analytics reveal so much more.

Share your links across the land,
Watch the data close at hand.
In this dashboard, stories grow—
Where your shortened URLs go.""",

    """A link too long, a burden to bear,
Through networks vast, through digital air.
We shorten the path, we lighten the load,
A compact address for every road.

Track each click, measure each view,
Analytics paint a picture true.
From source to destination we connect,
Every visitor's journey we detect.

Share and spread across the web,
Watch the traffic flow and ebb.
Short links carry far and wide,
Your content's reach, your digital pride.""",

    """Tiny URLs with mighty reach,
Spanning networks, shore to beach.
We compress the lengthy address,
Into links of pure success.

Metrics flow like rivers deep,
Every click we track and keep.
Statistics tell the story true,
Of visitors both old and new.

Connect the world with shortened paths,
Share your content, do the math.
Through our service, links take flight,
Bridging distances day and night.""",

    """From lengthy strings to short and sweet,
URLs transformed, a digital feat.
Each redirect a story told,
Through paths of data, clicks of gold.

We monitor the traffic stream,
Analytics fuel the dream.
Track the visits, count the views,
Insights emerge like morning dews.

Network bridges built with care,
Shortened links we freely share.
Connectivity our guiding star,
Reaching audiences near and far.""",

    """Short the link, vast the reach,
Every URL we teach.
To journey swift through cyberspace,
A compact path, a swift embrace.

Clicks recorded, data flows,
Analytics, insight grows.
Each metric paints a clearer view,
Of traffic patterns old and new.

Share the world with tiny strings,
Watch how far connection brings.
URLs shortened, dreams take flight,
Spreading content, spreading light.""",

    """Web addresses long and winding,
Shortened links—solutions finding.
Compact URLs, easy to share,
Delivered with precision and care.

Statistics dance across the screen,
Tracking journeys, paths unseen.
Click by click, the story builds,
Analytics dashboards that knowledge fills.

Connect communities far and wide,
On shortened links they safely glide.
Through networks vast, your message flies,
Beneath the ever-watching digital skies.""",

    """Transform the lengthy into brief,
URLs find their sweet relief.
Short codes guide the way ahead,
Through digital paths, by data led.

Monitor the flowing stream,
Metrics paint the traffic dream.
Every click a voice that speaks,
Analytics show what each user seeks.

Spread your message, share the link,
Watch connections grow and sync.
Network bonds forever grow,
Where shortened URLs freely flow.""",

    """In the web of links so vast,
Short URLs help content last.
Compact addresses, easy to send,
Reaching users end to end.

Track the clicks that come your way,
Analytics show night and day.
Measure visits, count the views,
Every statistic helps you choose.

Share and connect across the globe,
Through shortened links your stories probe.
Network threads that weave and bind,
Linking every curious mind."""
]


def generate_poem() -> str:
    """
    Generate a poem relevant to the URL shortening product domain.

    Returns:
        str: A poem containing references to URL/link shortening,
             analytics/tracking, and connectivity/sharing concepts.
    """
    return random.choice(POEM_TEMPLATES)


def generate_multiple_poems(count: int = 3) -> List[str]:
    """
    Generate multiple unique poems.

    Args:
        count: Number of poems to generate (max limited by available templates)

    Returns:
        List[str]: List of generated poems
    """
    available = len(POEM_TEMPLATES)
    actual_count = min(count, available)
    return random.sample(POEM_TEMPLATES, actual_count)


def contains_url_link_keywords(poem: str) -> bool:
    """
    Check if poem contains URL/link shortening related keywords.

    Args:
        poem: The poem text to analyze

    Returns:
        bool: True if poem contains at least one URL/link keyword
    """
    poem_lower = poem.lower()
    return any(keyword in poem_lower for keyword in URL_LINK_KEYWORDS)


def contains_analytics_tracking_keywords(poem: str) -> bool:
    """
    Check if poem contains analytics/tracking related keywords.

    Args:
        poem: The poem text to analyze

    Returns:
        bool: True if poem contains at least one analytics/tracking keyword
    """
    poem_lower = poem.lower()
    return any(keyword in poem_lower for keyword in ANALYTICS_TRACKING_KEYWORDS)


def contains_connectivity_sharing_keywords(poem: str) -> bool:
    """
    Check if poem contains connectivity/sharing related keywords.

    Args:
        poem: The poem text to analyze

    Returns:
        bool: True if poem contains at least one connectivity/sharing keyword
    """
    poem_lower = poem.lower()
    return any(keyword in poem_lower for keyword in CONNECTIVITY_SHARING_KEYWORDS)


def is_domain_relevant(poem: str) -> bool:
    """
    Check if poem is relevant to the URL shortening product domain.

    A poem is considered domain-relevant if it contains keywords
    from at least one of the domain categories.

    Args:
        poem: The poem text to analyze

    Returns:
        bool: True if poem is domain-relevant
    """
    return (
        contains_url_link_keywords(poem) or
        contains_analytics_tracking_keywords(poem) or
        contains_connectivity_sharing_keywords(poem)
    )


def get_domain_keywords_found(poem: str) -> dict:
    """
    Get all domain keywords found in a poem.

    Args:
        poem: The poem text to analyze

    Returns:
        dict: Dictionary with lists of found keywords by category
    """
    poem_lower = poem.lower()

    url_link_found = [kw for kw in URL_LINK_KEYWORDS if kw in poem_lower]
    analytics_found = [kw for kw in ANALYTICS_TRACKING_KEYWORDS if kw in poem_lower]
    connectivity_found = [kw for kw in CONNECTIVITY_SHARING_KEYWORDS if kw in poem_lower]

    return {
        "url_link": url_link_found,
        "analytics_tracking": analytics_found,
        "connectivity_sharing": connectivity_found
    }
