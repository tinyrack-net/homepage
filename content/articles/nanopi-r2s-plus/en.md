---
title: "Building Your Own Router: OpenWrt and R2S Plus"
excerpt: "Installing and using OpenWrt on the R2S Plus"
lang: "en"
routeSlug: "nanopi-r2s-plus"
translationKey: "nanopi-r2s-plus"
publishedAt: "2024-06-19T00:00:00.000+00:00"
updatedAt: "2025-12-06T12:52:35.000+00:00"
tags: ["blog", "linux"]
featureImage: "./images/feature-image.jpg"
commentsTerm: "nanopi-r2s-plus"
draft: false
---

A router is essentially a specialized computer designed for network processing, composed of both hardware and software. Therefore, in theory, a regular computer can function as a router, and vice versa.

However, most commercial routers come with proprietary firmware from the manufacturer, which, while user-friendly, often lacks additional features and long-term security updates.

To address this, the open-source community has developed various router operating systems that can replace manufacturer firmware. One of the most notable projects is OpenWrt. OpenWrt can be installed on supported commercial routers or on any desired hardware.

To explore OpenWrt, I purchased an open-source hardware device, the NanoPi R2S Plus, designed by FriendlyElec with OpenWrt usage in mind. This article will share my experience installing and using OpenWrt on this hardware.

---

## Hardware: NanoPi R2S Plus

Here's the FriendlyElec open-source hardware, R2S Plus, that I purchased.

![](./images/nanopi-r2s-plus-device.jpg)

Specifications are as follows:

- CPU: Rockchip RK3328 (4 Cores, ARM)

- RAM: 1GB DDR4

- Storage: 32GB eMMC

- Network: 2x Gigabit Ethernet

Although these specs might seem insignificant for a computer, they are quite high for a router in this price range, considering most commercial routers have only 256MB of RAM. Since a router solely handles network processing, it does not require high-end hardware like our daily computers.

As shown in the photo, it lacks Wi-Fi and has only two Ethernet ports. However, I planned to use my existing router in "bridge" mode, which I believed to be sufficient. In bridge mode, the existing router handles the additional LAN ports and Wi-Fi transmission, while the R2S Plus manages actual network processing. (A Wi-Fi module can be added to the R2S Plus if needed.)

One of the significant advantages of this model is its power efficiency. The R2S Plus can be powered via a USB-C port, consuming so little electricity that it can run on a PC's USB port power. This makes it ideal for those who need their router on all the time or want to use it portably with a laptop.

Finally, NanoPi products are highly likely to receive official OpenWrt support, and even if not, the manufacturer maintains OpenWrt distribution. This ensures continuous software updates and stable usage. Given its higher hardware specs compared to commercial routers, I expect long-term support.

> 💡 FriendlyElec distributes OpenWrt under the name FriendlyWrt. The R2S Plus is not officially supported by OpenWrt yet.

---

## *What is OpenWrt like?*

![](./images/friendlywrt-status-page.png)

Installing OpenWrt was very straightforward. Download the OpenWrt image from the FriendlyElec website, load it onto a MicroSD card, insert it into the device, and power it on. From there, you can conveniently manage it through a web browser like any other router.

The user interface was quite intuitive. Common functions like setting passwords, fixed DHCP IPs, and DDNS configurations were similar to those of commercial routers. Features crucial to me, such as `VLAN` settings, were also easy to configure. Below is a simple diagram of my network setup.

![](./images/r2s-plus-network-topology.png)

The R2S Plus's WAN is directly connected to the ISP's internet, and the LAN is connected to my existing managed switch, assigning VLAN groups as needed. The switch resolved the issue of limited ports and added security through VLAN separation. Without the switch, I would have connected a standard router in bridge mode.

Previously, I used OPNSense, a highly functional FreeBSD-based router software. While it met my needs, it required x64 hardware and complex configurations.

In contrast, OpenWrt needed relatively simple setups and provided all the necessary functions. I run additional services like VPN and DNS on my server cluster, so I didn't use many of the extra features. Lastly, the uniformity of having Linux-based OSs in my server rack offered a sense of stability.

---

## *Is the performance sufficient?*

> It's adequate for a home server.

My home serves as both a playground and a research lab, so my network usage is somewhat higher than an average household. I run various services on my home server, frequently using NextCloud externally, raising questions about handling high traffic.

The results showed no noticeable difference compared to my previous, more powerful x64 router (Intel N100). This was expected, given that my home server rarely had more than 30 concurrent users, and all additional services ran on the server rack, imposing minimal load on the router. The only limitation was my internet plan's speed cap.

Although I didn't conduct specific benchmarks, I believe it's more than adequate for general home or personal home server use. In fact, it might even be over-specced compared to many widely-used routers. However, I'm unsure about the Wi-Fi model's transmission performance.

For more information, you can refer to a [review of the R2S](https://forum.openwrt.org/t/nanopi-r2s-plus-out-4-year-review-of-r2s/183342), which has similar specs.

---

## *Is it worth buying?*

> It was perfect for me, but it's not for everyone.

I bought the R2S Plus to replace my existing fanless x64 router. Despite being a low-power, low-heat CPU, the N100 became too hot to touch the surface.

As summer arrived and temperatures rose, the router in the rack began shutting down due to overheating. I didn't want to install a fan in a fanless computer, so I decided to replace the router.

In this context, the R2S Plus was the perfect choice for me, meeting all my criteria: fanless, low power consumption, low heat, affordable price, and sufficient performance. I even bought another model with added Wi-Fi.

However, x64-based routers have significant advantages over ARM-based routers like the R2S Plus. They support general-purpose OSs, offering compatibility with powerful firewall solutions like PfSense and OPNSense. If you need such features, an x64-based router might be a better choice.

In conclusion, if you have any router or OS recommendations, please share them in the comments. Thank you.
