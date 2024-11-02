const { Client } = require('@notionhq/client');
const Parser = require('rss-parser');
const parser = new Parser();

const notion = new Client({ auth: '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' });

const readerDatabaseId = '13225bbf71c08112a0d6000ca2bf531c';
const feederDatabaseId = '13225bbf71c0818e8760000c9259a8b6';

const feeds = [
  'https://obsidian.md/feed.xml',
  'https://www.craft.do/feed/blog.xml',
  'https://blog.logseq.com/rss/',
  'https://forums.getdrafts.com/rss',
  'https://community.bear.app/rss',
  'https://www.redgregory.com/notion?format=rss',
  'https://mythical.ink/de/blog',
  'https://www.elderscrollsonline.com/en-us/rss'
];

async function fetchRSSFeeds() {
  let allEntries = [];

  for (const feed of feeds) {
    const rss = await parser.parseURL(feed);
    allEntries = allEntries.concat(rss.items);
  }

  return allEntries;
}

async function addEntriesToNotion(entries) {
  for (const entry of entries) {
    await notion.pages.create({
      parent: { database_id: feederDatabaseId },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: entry.title,
              },
            },
          ],
        },
        Link: {
          url: entry.link,
        },
        Date: {
          date: {
            start: new Date(entry.pubDate).toISOString()
          }
        }
      },
    });
  }
}

async function main() {
  const rssEntries = await fetchRSSFeeds();
  await addEntriesToNotion(rssEntries);
}

main().catch(console.error);
