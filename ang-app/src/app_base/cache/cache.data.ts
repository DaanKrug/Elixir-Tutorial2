export class CacheData {
	constructor(
		       public url: string, 
		       public conditions: string, 
			   public page: number,
			   public rows: number,
			   public data: any[],
			   public time: number
			   ) { 
	}
}