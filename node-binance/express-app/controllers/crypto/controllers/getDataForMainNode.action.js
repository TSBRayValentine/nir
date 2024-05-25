const sequelize = require("../../../config/db.config");
const Sequelize = require("sequelize");

module.exports.action = async (req, res) => {
  let SQL;

  // ----------------------------------------------------
  //  Шаг 1 - Получение цен и базовых криптовалют
  try {
    SQL = `
    WITH max_created_dates AS (
      SELECT 
          MAX(p.createdAt) AS max_price_created_at,
          MAX(i.createdAt) AS max_info_created_at
      FROM 
          price p
      INNER JOIN 
          info i ON p.symbol = i.symbol
  )
  SELECT 
      p.symbol, 
      i.baseAsset, 
      i.quoteAsset, 
      p.price
  FROM 
      price p
  INNER JOIN 
      info i ON p.symbol = i.symbol
  INNER JOIN 
      max_created_dates m ON p.createdAt = m.max_price_created_at AND i.createdAt = m.max_info_created_at
  WHERE  
      i.status <> 'BREAK';
  
  
    `;

    const data = await sequelize.query(SQL, {
      type: Sequelize.QueryTypes.SELECT,
    });

    // ----------------------------------------------------
    //  Шаг 2 - Получение всех криптовалют

    SQL = `
    SELECT baseAsset AS unique_values
    FROM info
    UNION
    SELECT quoteAsset
    FROM info;
`;
    let crypto = await sequelize.query(SQL, {
      type: Sequelize.QueryTypes.SELECT,
    });

    crypto.map((el) => {
      el.unique_values = el.unique_values;
    });

    crypto = crypto.map((item) => item.unique_values);

    // ----------------------------------------------------
    //  Шаг 3 - Отправка данных

    res.send({
      crypto: crypto,
      data: data,
    });
  } catch (error) {
    res.send(`Произошла ошибка при выполнении запроса ${error}`);
  }
};
