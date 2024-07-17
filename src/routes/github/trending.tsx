import { load } from 'cheerio';
import { createFactory } from 'hono/factory';
import { RSS } from '~/components/RSS';
import { IBindings } from '~/types';

const factory = createFactory<{Bindings:IBindings}>();

export const githubtrending = factory.createHandlers(async (c) => {
  const since = c.req.query('since') ?? 'daily';
  const language = c.req.query('language') ?? '';
  const spoken_language =  c.req.query('spoken_language') ?? '';

  const trendingUrl = `https://github.com/trending/${encodeURIComponent(language)}?since=${since}&spoken_language_code=${spoken_language}`;
  const data = await fetch(trendingUrl, {
    method: 'get',
    headers: {
      Referer: trendingUrl
    }
  });
  const trendingPage = await data.text();
  const $ = load(trendingPage);

  const articles = $('article');
  const trendingRepos = articles.toArray().map((item) => {
      const [owner, name] = $(item).find('h2').text().split('/');
      return {
          name: name.trim(),
          owner: owner.trim(),
      };
  });

  const repoData: any =  await(await fetch('https://api.github.com/graphql',{
      method: 'post',
      headers: {
        Authorization: `bearer ${c.env.GITHUB_TOKEN}`,
        'User-Agent': 'foo'
      },
      body: JSON.stringify({
          query: `
          query {
          ${trendingRepos
              .map(
                  (repo, index) => `
              _${index}: repository(owner: "${repo.owner}", name: "${repo.name}") {
                  ...RepositoryFragment
              }
          `
              )
              .join('\n')}
          }

          fragment RepositoryFragment on Repository {
              description
              forkCount
              nameWithOwner
              openGraphImageUrl
              primaryLanguage {
                  name
              }
              stargazerCount
          }
          `,
      }),
  })).json();

  const repos = Object.values(repoData.data).map((repo: any) => {
      const found = trendingRepos.find((r) => `${r.owner}/${r.name}` === repo.nameWithOwner);
      return { ...found, ...repo };
  });

  return c.html(<RSS data={{
    title: $('title').text(),
    link: trendingUrl,
    item: repos.map((r) => ({
        title: r.nameWithOwner,
        author: r.owner,
        description:<>
        {r.description}
        <br/>
        <img src={r.openGraphImageUrl}/>
        <br/>Language: {r.primaryLanguage?.name || 'Unknown'}&nbsp;&nbsp;Stars: {r.stargazerCount}&nbsp;&nbsp;Forks:{ r.forkCount}
        </>,
        link: `https://github.com/${r.nameWithOwner}`,
    })),
}} />,200, {
    'Content-Type':'application/xml; charset=utf-8' 
  })
})
