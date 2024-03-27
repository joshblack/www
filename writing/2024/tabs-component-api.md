---
title: Tabs API Design
description:
  'An overflow of the different techniques for building a Tabs component'
date: 2024-04-25
categories: []
---

Tabs are a baseline component used across many product experiences. It can be
used in both a navigational context and as a way to organize content. As a
result, there are different ways to design the API for your Tabs component.

This article will explore the various techniques for building a Tabs component.
It will also outline the terminology and requirements for the component that can
contribute to, or influence, its API design.

## Terminology

A Tabs component will encapsulate a list of tabs that each have a corresponding
tab panel. The list of tabs will use the
[`tablist` role](https://w3c.github.io/aria/#tablist). Each tab should be a
button that uses the [`tab` role](https://w3c.github.io/aria/#tab). The tab
panel uses the [`tabpanel` role](https://w3c.github.io/aria/#tabpanel).

When translating these roles into a component API, you may see some of the
following terminology or top-level components:

- `Tabs`: the container for the component, often used to coordinate state or as
  the container that receives a list of tabs
- `Tab`: a button that represents a `tab` in a list of tabs, corresponds to the
  `tab` role
- `TabList`: an optional component used to wrap a list of `Tab` components,
  corresponds to the `tablist` role
- `TabPanel`: a container for the content associated with a `Tab`, corresponds
  to the `tabpanel` role
- `TabPanels`: an optional component used to wrap a list of `TabPanel`
  components

## Accessibility considerations

<details>
<summary>Example Markup</summary>

```html
<div role="tablist">
  <button
    aria-selected="true"
    id="tab-1"
    role="tab"
    aria-controls="panel-1"
    tabindex="0">
    Tab 1
  </button>
  <button
    aria-selected="false"
    id="tab-2"
    role="tab"
    aria-controls="panel-2"
    tabindex="-1">
    Tab 2
  </button>
  <button
    aria-selected="false"
    id="tab-3"
    role="tab"
    aria-controls="panel-3"
    tabindex="-1">
    Tab 3
  </button>
</div>
<div aria-labelledby="tab-1" id="panel-1" role="tabpanel" tabindex="0">
  Panel 1
</div>
<div aria-labelledby="tab-2" id="panel-2" role="tabpanel" tabindex="0" hidden>
  Panel 2
</div>
<div aria-labelledby="tab-3" id="panel-3" role="tabpanel" tabindex="0" hidden>
  Panel 3
</div>
```

</details>

- ARIA Pattern
- Tabs are contained within a `tablist`
- Tabs are buttons with role `tab`
- Tabs are associated with a `tabpanel`
- Tab panels have role `tabpanel`
- Keyboard considerations
- Focus considerations for tab panel
- Disabled

## Component API

### Index-based

- Uses the position of a tab or tab panel to create a relationship

```tsx
<Tabs>
  <TabList>
    <Tab>Tab 1</Tab>
    <Tab>Tab 2</Tab>
    <Tab>Tab 3</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>Panel 1</TabPanel>
    <TabPanel>Panel 2</TabPanel>
    <TabPanel>Panel 3</TabPanel>
  </TabPanels>
</Tabs>
```

#### Examples using an index-based approach

- [Atlassian UI](https://atlassian.design/components/tabs/examples)
- [Carbon](https://carbondesignsystem.com/components/tabs/usage/)
- [Reach UI](https://reach.tech/tabs/)
- [Chakra UI](https://chakra-ui.com/docs/components/tabs/usage)

### Value-based

- Uses a special "value" prop to connect a tab and tab panel

```tsx
<Tabs>
  <TabList>
    <Tab value="one">Tab 1</Tab>
    <Tab value="two">Tab 2</Tab>
    <Tab value="three">Tab 3</Tab>
  </TabList>
  <TabPanels>
    <TabPanel value="one">Panel 1</TabPanel>
    <TabPanel value="two">Panel 2</TabPanel>
    <TabPanel value="three">Panel 3</TabPanel>
  </TabPanels>
</Tabs>
```

#### Examples using a value-based approach

- [Radix UI](https://www.radix-ui.com/primitives/docs/components/tabs)
- [Material UI](https://mui.com/material-ui/react-tabs/)
- [Mantine](https://mantine.dev/core/tabs/)
- [Fluent UI](https://react.fluentui.dev/?path=/docs/components-tablist--default)

### Data-based

- Uses a dedicated prop that accepts a collection of objects which represent the
  connected tab and panel

```tsx
<Tabs
  data={[
    {
      tab: 'Tab 1',
      panel: 'Panel 1',
    },
    {
      tab: 'Tab 2',
      panel: 'Panel 2',
    },
    {
      tab: 'Tab 3',
      panel: 'Panel 3',
    },
  ]}
/>
```

#### Examples using a data-based approach

- [Ant Design](https://ant.design/components/tabs/)
- [Shopify Polaris](https://polaris.shopify.com/components/navigation/tabs)

### Single component

- Uses a single component to represent both the tab and tab panel

```tsx
<Tabs>
  <Tab title="Tab 1">Panel 1</Tab>
  <Tab title="Tab 2">Panel 2</Tab>
  <Tab title="Tab 3">Panel 3</Tab>
</Tabs>
```

#### Examples using a single component approach

- [Base Web](https://baseweb.design/components/tabs/)

### (Bonus) Shadow DOM

- Shadow DOM provides an opportunity to consolidate or remove certain structural
  parts of the API due to slots (like tablist)

#### Examples using a Shadow DOM approach

- [Shoelace](https://shoelace.style/components/tab-group)

## Wrapping up
