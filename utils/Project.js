import { apiServerMedia } from "./api"
import { Member } from "./Member"

class ProjectMedia {
    type
    filename
    
    constructor(data) {
        this.type = data.type
        this.filename = data.filename
    }
    get url() {
        return `${apiServerMedia}/v1/media/projects/${this.filename}`
    }
}

class ProjectLink {
    /**
     * @type {('github'|'homepage'|'link')}
     */
    type

    /**
     * Link's full URL
     * @type {String}
     */
    url

    /**
     * If link is external, the name for the site
     * Can be pulled from page's HTML title in the backend
     */
    name

    constructor(data) {
        this.type = data.type
        this.url = data.url
        this.name = data.name
    }

    /**
     * Display title
     */
    get title() {
        if (this.type == "link" && this.name) return this.name
        if (this.type == "homepage") return "Kotisivut"
        if (this.github == "github") return "GitHub"

        return ""
    }

    /**
     * Literally "display url"
     * It's the url for display purposes, but a short variant
     */
    get displayURL() {
        if (this.type == "github") {
            return this.url.match(/github.com\/([^\/]+)\/([^\/]+)/).slice(1,3).join("/")
        } else {
            return ""
        }
    }
}
export class Project {
    id
    name
    slug
    description
    members
    media
    tags
    links

    constructor(data) {
        if (data._id) this.id = data._id
        this.name = data.name
        this.slug = data.slug

        if (typeof data.description == "object") {
            this.description = data.description
        } else {
            this.description = {
                short: data.description
            }
        }
        this.members = data.members.map(data => new Member(data))
        
        if (typeof data.media == "object") {
            this.media = data.media.map(data => new ProjectMedia(data))
        } else {
            this.media = new ProjectMedia(data.media)
        }
        this.tags = data.tags

        if (data.links) {
            this.links = data.links.map(link => new ProjectLink(link))
        }
    }
}