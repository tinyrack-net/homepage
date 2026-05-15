---
title: "Overpriced Over-Engineering: The Cloud"
excerpt: "Why Self-Hosting Might Be Better"
lang: "en"
routeSlug: "over-engineered-cloud"
translationKey: "over-engineered-cloud"
publishedAt: "2024-07-06T13:41:00.000+00:00"
updatedAt: "2025-12-06T19:10:31.000+00:00"
tags: ["blog", "cloud"]
featureImage: "./images/feature-image.webp"
commentsTerm: "over-engineered-cloud"
draft: false
---

Recently, thanks to the YouTube algorithm, I stumbled upon an interesting video titled ["The cloud is over-engineered and overpriced"](https://www.youtube.com/watch?v=jFrGhodqC08&list=WL&index=2&t=24s). The main argument of the video is that small-scale startups should avoid adopting the cloud. Instead, it introduces how to run a simple on-premise self-hosting server using Docker-based technology.

While watching this video, I found points I agreed with and others I disagreed with. I decided to share the video's content, the reactions from the comments, and my own thoughts.

[The cloud is over-engineered and overpriced (no music)](https://www.youtube.com/watch?v=jFrGhodqC08)

---

## Main Points

An average SaaS startup spends about $1,160,000 annually on the cloud, which translates to around 1.5 billion KRW at the current exchange rate. This amount is significantly higher than the cost of renting server equipment and hiring a couple of specialized management personnel.

However, there are benefits to using the cloud. Most functionalities can be easily managed via a UI, eliminating the need for experts, and scaling servers for high availability is simple. In other words, we gain convenience.

But this isn't entirely true. Despite using the cloud for convenience, we still need to hire AWS-certified experts. Isn't it surprising that we need experts to configure AWS? Wasn't the main reason for using the cloud its simplicity?

Consequently, startups end up spending all the money they receive from investors on AWS. However, most of the features we use on AWS (like ECR, ECS, RDS, ALB) can achieve similar results with Linux servers, Git, Docker, and a few open-source tools.

---

This is the introduction of the video. It then guides viewers on how to operate an old laptop as a self-hosted Linux server. Finally, it concludes with a discussion of criticisms and responses to this server operation method. The main criticisms and responses are as follows:

- Don't we need the high availability of the cloud?

> Scenarios requiring a tenfold or hundredfold expansion in one day are extremely rare.
> If a website experiences explosive growth, it's better to have downtime.
> Steady growth, even if slow, is more typical.
> We only want to scale when we are sure the traffic is not malicious and we can afford the costs healthily.

- Isn't the cloud easier to start with?

> Often, simplicity is just an abstraction of complexity, and complexity can actually be simple.
> I prefer engines that I can understand over those that don't fit the use case.
> The cloud is easy to start with, but once you use its scalability, you fall into the trap of excessive costs.
> I will always choose simple tools over easy ones. Simplicity is difficult but better in the long run.

- What if we need to provide the same quality globally?

> To deliver dynamic content that cannot be cached across multiple regions without delay, the cloud is certainly needed.
> Each product has different requirements, and the cloud is the best solution in some cases.
> However, for most startups, this is unnecessary.
> You are not a Fortune 500 company and do not need to operate like one.

---

## My Thoughts

The startups I have worked for also used the cloud from the beginning. I believe most domestic service startups also choose the cloud for convenience or future growth considerations. Perhaps some practitioners use familiar methods without much thought. (I do that sometimes too.)

However, the cloud is undoubtedly expensive. The cloud adopts a pricing strategy that starts cheap but increases steeply with service growth. Nowadays, with SSR becoming the trend in front-end development, container services, which are more expensive than cheap file servers, are being used, leading to higher costs.

Also, because horizontal scaling is so easy with the cloud, inefficiencies in applications causing availability issues are often quickly resolved by scaling horizontally, which can be problematic. While it’s hard to criticize this since normalizing the service is a priority, promised improvements are easily forgotten later. These issues also contribute to increased costs.

So, do I believe Self-Hosting must be used? Not necessarily. The cloud's high availability and stability are definite advantages, and its convenience cannot be ignored. Therefore, I prefer to use Self-Hosting open-source apps for all internal services except for operational services. Internal services include the following:

- Deployment servers for development

- Git servers (Gittea, Gitlab, etc.)

- CI/CD servers (Jenkins, etc.)

- VPN (Wireguard, OpenVPN, etc.)

- Other internal work-related services (chat, Wiki, back-office, etc.)

These services, even if they break, do not affect operational services, making Self-Hosting suitable. When using the cloud, as a front-end developer, I usually apply the following rules:

- Prefer SSG over SSR. (Clients can handle some computation.)

- Deploy apps made with SSG through the cloud. (This is cheap or free.)

- Use SSR only when truly necessary for 'dynamic' content.

In summary, I believe startups should use both Self-Hosting and the cloud. I think there are ways to leverage the convenience and stability of the cloud while reducing costs.

Personally, I actively use Self-Hosting. This blog and documents are distributed via Cloudflare with SSG, and all other services are operated on my personal server rack (KVM, Docker) at home.

I don't think we should start solely with Self-Hosting like the video suggests, but it might be worth considering if we're unnecessarily increasing our cloud spending.

---

## Reactions from the Comments

To conclude, here are some selected comments from the video. It’s clear that not everyone agrees with Self-Hosting, but there are quite a few successful transition stories. Maybe one day I’ll attempt a commercial project with Self-Hosting too.

> Currently at a startup: moved everything from AWS to Linode, using Kubernetes to deploy with open-source solutions. The total operational cost of a horizontally scaled SaaS app is $50 per week, $2600 per year.

> AWS, Azure, and Google price on a curve. It’s cheap at first, but once you use the useful “scalability,” you end up in a trap of excessive costs.

> Built my second startup using FreeBSD, Git, and Gitlab CI/CD. It’s definitely possible to avoid the complexity of the cloud. I like the approach shown here. It’s simple and clean, yet leaves options for later.

> This is an excellent self-hosting guide, and you’re right about the downsides of cloud services. I’m not advocating for cloud services, but I must mention that there’s a significant difference between what’s shown here and what’s needed for commercial-scale operations.

> For initial or small deployments, using the cloud for high reliability makes sense. The cost of reliable internet and power generally exceeds cloud costs (e.g., Lambda + RDS instances).

What are your thoughts on Self-Hosting?
