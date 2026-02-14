const supabase = require('@supabase/supabase-js').createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

class Currency {
  static async getRate(code) {
    const { data } = await supabase.from('currency_rates').select('*').eq('currency_code', code).single();
    return data || { rate: 1 };
  }
  static async updateRate(code, rate) {
    const { data } = await supabase.from('currency_rates').upsert({ currency_code: code, rate });
    return data;
  }
}

module.exports = Currency;
