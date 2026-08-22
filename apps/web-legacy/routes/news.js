/**
 * News Routes
 * Handles all news-related routes
 */

const express = require('express');
const router = express.Router();
const { loadNews, organizeNewsByDate, fetchOnlineUsersCount } = require('../services/news');
const { generatePage } = require('../services/html');
const { getUserInfo } = require('../services/auth');
const { formatDate, escapeHtml, MONTH_NAMES } = require('../utils/helpers');
const { makeApiRequest } = require('../services/api');

// Route: Archives page (default to most recent month)
// NOTE: This must come BEFORE /news/:slug to avoid route conflicts
router.get('/archives', async (req, res) => {
    // Get user info for header
    const user = await getUserInfo(req, false);
    
    const newsData = await loadNews();
    const newsItems = newsData.items || [];
    const organized = organizeNewsByDate(newsItems);
    
    // Filter years to only show 2025 and later
    const allYears = Object.keys(organized).map(y => parseInt(y)).filter(y => y >= 2025).sort((a, b) => b - a);
    
    if (allYears.length === 0) {
        const bodyContent = `<section id="news">
	<h1 class="sect-h" id="news_title">
		<span>News</span>
    </h1>
    <div class="card">
        <p>No news available.</p>
    </div>
</section>`;
        const html = generatePage('OpenSpell - News Archives', bodyContent, null, user);
        return res.send(html);
    }
    
    // Find the most recent year and month with news
    const displayYear = allYears[0];
    const displayMonth = Math.max(...Object.keys(organized[displayYear]).map(m => parseInt(m)));
    
    // Generate year links (2025 and later)
    const yearLinks = allYears.map(y => {
        const lastMonth = Math.max(...Object.keys(organized[y]).map(m => parseInt(m)));
        return `                <div><a href="/news/archives/${y}/${lastMonth}">${y}</a></div>`;
    }).join('\n            \n');
    
    // Generate month links for the display year (show all 12 months)
    const monthLinks = [];
    for (let m = 1; m <= 12; m++) {
        const hasNews = organized[displayYear] && organized[displayYear][m];
        if (hasNews) {
            const isActive = m === displayMonth ? ' style="font-weight: 600;"' : '';
            monthLinks.push(`                    <div><a href="/news/archives/${displayYear}/${m}"${isActive}>${MONTH_NAMES[m - 1]}</a></div>`);
        } else {
            // Grey out months with no news
            monthLinks.push(`                    <div style="color: #888; opacity: 0.6;">${MONTH_NAMES[m - 1]}</div>`);
        }
    }
    
    // Get news for the selected month
    const monthNews = organized[displayYear] && organized[displayYear][displayMonth] 
        ? organized[displayYear][displayMonth] 
        : [];
    
    const newsList = monthNews.length > 0
        ? monthNews.map(item => {
            const formattedDate = formatDate(item.date);
            return `            <div class="news-item">
    <img class="news-thumb" width="180" height="120" src="${item.thumbnail || '/images/logo.png'}" alt="${escapeHtml(item.title)}" title="${escapeHtml(item.title)}" />
    <div>
        <div class="news-h"><a href="/news/${item.slug}" title="${escapeHtml(item.title)}">${escapeHtml(item.title)}</a></div>
        <div class="news-meta"><a href="#" title="${escapeHtml(item.type || 'Game')}">${escapeHtml(item.type || 'Game')}</a> | ${formattedDate}</div>
        <div class="news-desc art-body">${escapeHtml(item.description)} <a href="/news/${item.slug}" title="Read More">...Read More</a></div>
    </div>
</div>`;
        }).join('\n            \n')
        : '            No news found for this month';
    
    const bodyContent = `<section id="news">

	<h1 class="sect-h" id="news_title">
		<span>News</span>
    </h1>

    <div class="card scroll-x">
        <div class="news-nav year-nav">
            
${yearLinks}
            
        </div>
    </div>

    <div class="card scroll-x">
        <div class="news-nav">
            
${monthLinks.join('\n            \n')}
            
        </div>
    </div>
    
    <h1 class="sect-h">
        <span>${MONTH_NAMES[displayMonth - 1]} ${displayYear}</span>
    </h1>

    <div class="card">
        
${newsList}
        
    </div>

</section>`;

    const html = generatePage('OpenSpell - News Archives', bodyContent, null, user);
    res.send(html);
});

// Route: Archives page for specific year/month
router.get('/archives/:year/:month', async (req, res) => {
    // Get user info for header
    const user = await getUserInfo(req, false);
    
    const year = parseInt(req.params.year);
    const month = parseInt(req.params.month);
    
    if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
        return res.status(400).send('Invalid year or month');
    }
    
    const newsData = await loadNews();
    const newsItems = newsData.items || [];
    const organized = organizeNewsByDate(newsItems);
    
    // Filter years to only show 2025 and later
    const allYears = Object.keys(organized).map(y => parseInt(y)).filter(y => y >= 2025).sort((a, b) => b - a);
    
    // Generate year links (2025 and later)
    const yearLinks = allYears.map(y => {
        const lastMonth = Math.max(...Object.keys(organized[y]).map(m => parseInt(m)));
        return `                <div><a href="/news/archives/${y}/${lastMonth}">${y}</a></div>`;
    }).join('\n            \n');
    
    // Generate month links for the selected year (show all 12 months)
    const monthLinks = [];
    for (let m = 1; m <= 12; m++) {
        const hasNews = organized[year] && organized[year][m];
        if (hasNews) {
            const isActive = m === month ? ' style="font-weight: 600;"' : '';
            monthLinks.push(`                    <div><a href="/news/archives/${year}/${m}"${isActive}>${MONTH_NAMES[m - 1]}</a></div>`);
        } else {
            // Grey out months with no news
            monthLinks.push(`                    <div style="color: #888; opacity: 0.6;">${MONTH_NAMES[m - 1]}</div>`);
        }
    }
    
    // Get news for the selected month
    const monthNews = organized[year] && organized[year][month] 
        ? organized[year][month] 
        : [];
    
    const newsList = monthNews.length > 0
        ? monthNews.map(item => {
            const formattedDate = formatDate(item.date);
            return `            <div class="news-item">
    <img class="news-thumb" width="180" height="120" src="${item.thumbnail || '/images/logo.png'}" alt="${escapeHtml(item.title)}" title="${escapeHtml(item.title)}" />
    <div>
        <div class="news-h"><a href="/news/${item.slug}" title="${escapeHtml(item.title)}">${escapeHtml(item.title)}</a></div>
        <div class="news-meta"><a href="#" title="${escapeHtml(item.type || 'Game')}">${escapeHtml(item.type || 'Game')}</a> | ${formattedDate}</div>
        <div class="news-desc art-body">${escapeHtml(item.description)} <a href="/news/${item.slug}" title="Read More">...Read More</a></div>
    </div>
</div>`;
        }).join('\n            \n')
        : '            No news found for this month';
    
    const bodyContent = `<section id="news">

	<h1 class="sect-h" id="news_title">
		<span>News</span>
    </h1>

    <div class="card scroll-x">
        <div class="news-nav year-nav">
            
${yearLinks}
            
        </div>
    </div>

    <div class="card scroll-x">
        <div class="news-nav">
            
${monthLinks.join('\n            \n')}
            
        </div>
    </div>
    
    <h1 class="sect-h">
        <span>${MONTH_NAMES[month - 1]} ${year}</span>
    </h1>

    <div class="card">
        
${newsList}
        
    </div>

</section>`;

    const html = generatePage('OpenSpell - News Archives', bodyContent, null, user);
    res.send(html);
});

// Route: Handle /news/archives.html (redirect to /news/archives)
router.get('/archives.html', (req, res) => {
    res.redirect('/news/archives');
});

// Route: Individual news article
// NOTE: This must come AFTER /news/archives routes to avoid conflicts
router.get('/:slug', async (req, res) => {
    // Get user info for header
    const user = await getUserInfo(req, false);
    
    const renderArticle = (article) => {
        const formattedDate = formatDate(article.date);

        // Build article content with picture if provided
        let articleContent = article.content || '';

        // Add picture image at the top if picture is provided
        if (article.picture) {
            const pictureAlt = escapeHtml(article.title);
            const pictureTitle = escapeHtml(article.title);
            articleContent = `<div class="flexbox-with-centered-content"><img src="${escapeHtml(article.picture)}" alt="${pictureAlt}" title="${pictureTitle}"></div><br/>${articleContent}`;
        }

        const bodyContent = `<section id="news-article">

	<div class="card">

        <div class="news-article-head">

            <h1 id="news-article_title">
                ${escapeHtml(article.title)}
            </h1>
    
            <div class="news-article-date">${formattedDate}</div>

        </div>

        <div class="art-box sel">
            <div class="news-article art-body">${articleContent}</div>
        </div>
        
    </div>
    
</section>`;

        const html = generatePage(`OpenSpell - ${article.title}`, bodyContent, article.description, user);
        return res.send(html);
    };

    // Try to fetch from API first
    try {
        const response = await makeApiRequest(`/api/news/${req.params.slug}`);
        const article = response;
        return renderArticle(article);
    } catch (error) {
        console.warn('Failed to fetch news article from API:', error.message);
    }
    
    // If API is down, serve from cached news list (if we have one).
    const newsData = await loadNews();
    const newsItems = newsData.items || [];
    const article = newsItems.find(item => item.slug === req.params.slug);
    
    if (!article) {
        const bodyContent = `<section id="news-article">

	<div class="card">
        <div class="news-article-head">
            <h1 id="news-article_title">News temporarily unavailable</h1>
            <div class="news-article-date"></div>
        </div>
        <div class="art-box sel">
            <div class="news-article art-body">
                We couldn't load this article right now because the API is unavailable.<br/><br/>
                Please try again in a moment.
            </div>
        </div>
    </div>
    
</section>`;

        const html = generatePage('OpenSpell - News Unavailable', bodyContent, 'News temporarily unavailable', user);
        return res.status(503).send(html);
    }

    return renderArticle(article);
});

module.exports = router;

