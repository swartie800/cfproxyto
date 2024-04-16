export interface Env {}

const headers = {
	Referer: 'https://e69975b881.nl/',
};

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);
		const port = url.port;
		const host = 'https://' + url.hostname + '/';
		const pathname = url.pathname;
		const splitedPath = pathname.split('/');
		const link = splitedPath[1];
		const decodedLink = decodeURIComponent(link).trim();

		const pattern = /\/h\/list/;
		const test = pattern.test(decodedLink);

		const res = await fetch(decodedLink, { headers: headers });
		const buffer = await res.arrayBuffer();
		// const textbuffer = await res.text()
		// const txt:stri = buffer
		if (decodedLink.endsWith('.m3u8') && !test) {
			const text = new TextDecoder().decode(buffer);
			const splited = text.split('\n');
			splited.map((line, index) => {
				const t_line = line.trim();

				if (t_line.startsWith('https://')){
					splited[index] = host + encodeURIComponent(t_line);
				}
			});
			const joined = splited.join('\n');
			const response = new Response(joined);
			response.headers.set('Access-Control-Allow-Origin', '*');
			return response;
		} else if (decodedLink.endsWith('.m3u8') && test) {
			const text = new TextDecoder().decode(buffer);
			const splited = text.split('\n');
			const splitedUrl = decodedLink.split(/\/list/);
			const mainPart = splitedUrl[0];
			splited.map((line, index) => {
				const t_line: string = line.trim();
				if (/.m3u8/.test(t_line)) {
					// console.log(t_line)
					splited[index] = host + encodeURIComponent(mainPart + '/' + t_line);
					console.log(splited[index]);
				}
			});
			const joined = splited.join('\n');
			const response = new Response(joined);
			response.headers.set('Access-Control-Allow-Origin', '*');
			return response;
		} else {
			const response = new Response(buffer);
			response.headers.set('Access-Control-Allow-Origin', '*');
			return response;
		}
	},
};
