// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export type OpenSourceExperience = {
  projectName: string;
  description: string;
  period: string;
  features: string[];
  publicLink: string;
};

export type WorkExperience = {
  companyName: string;
  country: string;
  position: string;
  period: string;
  main: string;
  projects: {
    title: string;
    description: string;
    period: string;
    goals: string[];
  }[];
};

export const SITE_TITLES = {
  en: "winetree94",
  ko: "winetree94",
};

export const SITE_DESCRIPTIONS = {
  en: "winetree94's blog",
  ko: "winetree94's blog",
};

export const SITE_IMAGES = {
  en: "/og/index/en.png",
  ko: "/og/index/ko.png",
};

export const PERSONAL_LINKS = [
  {
    name: "Github",
    url: "https://github.com/winetree94",
  },
  {
    name: "NPM",
    url: "https://www.npmjs.com/~winetree94",
  },
  {
    name: "Docker Hub",
    url: "https://hub.docker.com/u/winetree94",
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/winetree94",
  },
  {
    name: "Reddit",
    url: "https://www.reddit.com/user/No_Fail_5663/",
  },
  {
    name: "Blog (Old)",
    url: "https://winetree94.notion.site",
  },
];

export const OPEN_SOURCE: OpenSourceExperience[] = [
  {
    projectName: "about.open_source.edybara.title",
    description: "about.open_source.edybara.description",
    period: "about.open_source.edybara.period",
    features: [
      "about.open_source.edybara.features.1",
      "about.open_source.edybara.features.2",
      "about.open_source.edybara.features.3",
    ],
    publicLink: "about.open_source.edybara.link",
  },
  {
    projectName: "about.open_source.qdocs.title",
    description: "about.open_source.qdocs.description",
    period: "about.open_source.qdocs.period",
    features: [
      "about.open_source.qdocs.features.1",
      "about.open_source.qdocs.features.2",
    ],
    publicLink: "about.open_source.qdocs.link",
  },
  {
    projectName: "about.open_source.vector_optimizer.title",
    description: "about.open_source.vector_optimizer.description",
    period: "about.open_source.vector_optimizer.period",
    features: [
      "about.open_source.vector_optimizer.features.1",
      "about.open_source.vector_optimizer.features.2",
    ],
    publicLink: "about.open_source.vector_optimizer.link",
  },
  {
    projectName: "about.open_source.vanilla_recycler_view.title",
    description: "about.open_source.vanilla_recycler_view.description",
    period: "about.open_source.vanilla_recycler_view.period",
    features: [
      "about.open_source.vanilla_recycler_view.features.1",
      "about.open_source.vanilla_recycler_view.features.2",
    ],
    publicLink: "about.open_source.vanilla_recycler_view.link",
  },
];

export const WORK_EXPERIENCE: WorkExperience[] = [
  {
    companyName: "about.experience.swit.title",
    main: "about.experience.swit.main",
    country: "about.experience.swit.country",
    position: "about.experience.swit.roll",
    period: "about.experience.swit.period",
    projects: [
      {
        title: "about.experience.swit.features.editor.title",
        period: "about.experience.swit.features.editor.period",
        description: "about.experience.swit.features.editor.description",
        goals: [
          "about.experience.swit.features.editor.rolls.1",
          "about.experience.swit.features.editor.rolls.2",
          "about.experience.swit.features.editor.rolls.3",
          "about.experience.swit.features.editor.rolls.4",
          "about.experience.swit.features.editor.rolls.5",
        ],
      },
      {
        title: "about.experience.swit.features.auth.title",
        period: "about.experience.swit.features.auth.period",
        description: "about.experience.swit.features.auth.description",
        goals: [
          "about.experience.swit.features.auth.rolls.1",
          "about.experience.swit.features.auth.rolls.2",
          "about.experience.swit.features.auth.rolls.3",
          "about.experience.swit.features.auth.rolls.4",
        ],
      },
      {
        title: "about.experience.swit.features.language.title",
        period: "about.experience.swit.features.language.period",
        description: "about.experience.swit.features.language.description",
        goals: [
          "about.experience.swit.features.language.rolls.1",
          "about.experience.swit.features.language.rolls.2",
        ],
      },
      {
        title: "about.experience.swit.features.design_system.title",
        period: "about.experience.swit.features.design_system.period",
        description: "about.experience.swit.features.design_system.description",
        goals: [
          "about.experience.swit.features.design_system.rolls.1",
          "about.experience.swit.features.design_system.rolls.2",
          "about.experience.swit.features.design_system.rolls.3",
        ],
      },
      {
        title: "about.experience.swit.features.task.title",
        period: "about.experience.swit.features.task.period",
        description: "about.experience.swit.features.task.description",
        goals: [
          "about.experience.swit.features.task.rolls.1",
          "about.experience.swit.features.task.rolls.2",
          "about.experience.swit.features.task.rolls.3",
        ],
      },
    ],
  },
  {
    companyName: "about.experience.epapyrus.title",
    country: "about.experience.epapyrus.country",
    position: "about.experience.epapyrus.roll",
    main: "about.experience.epapyrus.main",
    period: "about.experience.epapyrus.period",
    projects: [
      {
        title: "about.experience.epapyrus.features.pen.title",
        period: "about.experience.epapyrus.features.pen.period",
        description: "about.experience.epapyrus.features.pen.description",
        goals: [
          "about.experience.epapyrus.features.pen.rolls.1",
          "about.experience.epapyrus.features.pen.rolls.2",
        ],
      },
      {
        title: "about.experience.epapyrus.features.pki.title",
        period: "about.experience.epapyrus.features.pki.period",
        description: "about.experience.epapyrus.features.pki.description",
        goals: [
          "about.experience.epapyrus.features.pki.rolls.1",
          "about.experience.epapyrus.features.pki.rolls.2",
        ],
      },
    ],
  },
  {
    companyName: "about.experience.playauto.title",
    country: "about.experience.playauto.country",
    position: "about.experience.playauto.roll",
    main: "about.experience.playauto.main",
    period: "about.experience.playauto.period",
    projects: [
      {
        title: "about.experience.playauto.features.multi_framework.title",
        period: "about.experience.playauto.features.multi_framework.period",
        description:
          "about.experience.playauto.features.multi_framework.description",
        goals: [
          "about.experience.playauto.features.multi_framework.rolls.1",
          "about.experience.playauto.features.multi_framework.rolls.2",
        ],
      },
      {
        title: "about.experience.playauto.features.datatable.title",
        period: "about.experience.playauto.features.datatable.period",
        description: "about.experience.playauto.features.datatable.description",
        goals: [
          "about.experience.playauto.features.datatable.rolls.1",
          "about.experience.playauto.features.datatable.rolls.2",
        ],
      },
      {
        title: "about.experience.playauto.features.pa_global.title",
        period: "about.experience.playauto.features.pa_global.period",
        description: "about.experience.playauto.features.pa_global.description",
        goals: [
          "about.experience.playauto.features.pa_global.rolls.1",
          "about.experience.playauto.features.pa_global.rolls.2",
        ],
      },
    ],
  },
  {
    companyName: "about.experience.jdlab.title",
    country: "about.experience.jdlab.country",
    position: "about.experience.jdlab.roll",
    main: "about.experience.jdlab.main",
    period: "about.experience.jdlab.period",
    projects: [
      {
        title: "about.experience.jdlab.features.exim.title",
        period: "about.experience.jdlab.features.exim.period",
        description: "about.experience.jdlab.features.exim.description",
        goals: [
          "about.experience.jdlab.features.exim.rolls.1",
          "about.experience.jdlab.features.exim.rolls.2",
        ],
      },
      {
        title: "about.experience.jdlab.features.bupasa.title",
        period: "about.experience.jdlab.features.bupasa.period",
        description: "about.experience.jdlab.features.bupasa.description",
        goals: [
          "about.experience.jdlab.features.bupasa.rolls.1",
          "about.experience.jdlab.features.bupasa.rolls.2",
        ],
      },
    ],
  },
];

export const OWNER_NAME = "winetree94";

export const LINKS = {
  GITHUB: "https://github.com/winetree94",
  NPM: "https://www.npmjs.com/~winetree94",
  LINKEDIN: "https://www.linkedin.com/in/winetree94",
  EMAIL: "me@winetree94.com",
};

export const SITE_TITLE = "winetree94";
export const SITE_DESCRIPTION = "winetree94 world";
