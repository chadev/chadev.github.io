---
layout: default
---
# Community Resources
{% for resource in site.data.resources %}
-   ## [{{ resource.name }}]({{ resource.url }})
{% endfor %}
<!-- Suggestion for making this a list
* 
* - title: Chattanooga Open Device Lab
* 	url: http://chadevicelab.org
* 	description: "The Chattanooga Open Device Lab is a free resource for Chattanooga’s design and development community sponsored by Easy Designs and made possible by generous donations from the community. At the lab, members can test their work on a wide range of devices to see how well it looks and functions. We also provide access to over 500 virtualized browser/OS combinations via BrowserStack."
* 	
* -->
