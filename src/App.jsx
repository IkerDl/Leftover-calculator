import React, { useState } from 'react';
import './App.css';
import logo from './assets/adidas-logo-black-symbol-clothes-design-icon-abstract-football-illustration-with-white-background-free-vector.jpg';

const App = () => {
  const [costPrice, setCostPrice] = useState('');
  const [conceptPrice, setConceptPrice] = useState('');
  const [outletPrice, setOutletPrice] = useState('');
  const [results, setResults] = useState({
    costPriceResult: { value: '', className: '' },
    conceptPriceResult: { value: '', className: '' },
    outletPriceResult: { value: '', className: '' },
    finalResult: ''
  });

  const getElementValue = (value) => parseFloat(value);

  const isValid = (value) => !isNaN(value) && value >= 0;

  const updateResult = (value, isValid) => ({
    value: `(${value.toFixed(2)} €)`,
    className: isValid ? 'result green' : 'result red'
  });

  const calculate = () => {
    const costPriceValue = getElementValue(costPrice);
    const conceptPriceValue = getElementValue(conceptPrice);
    const outletPriceValue = getElementValue(outletPrice);

    if (!isValid(costPriceValue) || !isValid(conceptPriceValue) || !isValid(outletPriceValue)) {
      setResults({
        ...results,
        finalResult: "Por favor, ingrese valores válidos en todas las casillas."
      });
      return;
    }

    const priceWithIVA = costPriceValue * 1.21;
    const minConceptPrice = conceptPriceValue * 0.2;
    const preLeftOver = outletPriceValue * 0.7;

    const costPriceResult = updateResult(priceWithIVA, preLeftOver >= priceWithIVA);
    const conceptPriceResult = updateResult(minConceptPrice, preLeftOver >= minConceptPrice);
    const outletPriceResult = updateResult(preLeftOver, preLeftOver >= minConceptPrice && preLeftOver >= priceWithIVA);

    const issues = [];
    let exceedsAnyLimit = false;
    let exceedsAllLimits = false;

    if (preLeftOver < priceWithIVA) {
      issues.push("El precio del Leftover es inferior al precio de coste con IVA.");
      exceedsAnyLimit = true;
    }
    if (preLeftOver < minConceptPrice) {
      issues.push("El Leftover supera el 80% de descuento del precio de origen.");
      exceedsAnyLimit = true;
    }
    if (preLeftOver > outletPriceValue) {
      issues.push("El precio del Leftover supera el máximo del 80% permitido.");
    }

    if (preLeftOver < priceWithIVA && preLeftOver < minConceptPrice) {
      exceedsAllLimits = true;
    }

    setResults({
      costPriceResult: costPriceResult,
      conceptPriceResult: conceptPriceResult,
      outletPriceResult: outletPriceResult,
      finalResult: exceedsAllLimits
        ? "El precio del LeftOver sobrepasa los límites."
        : exceedsAnyLimit
          ? issues.join(" ")
          : `Precio final después del descuento: ${preLeftOver.toFixed(2)} €`
    });
  };

  const reset = () => {
    setCostPrice('');
    setConceptPrice('');
    setOutletPrice('');
    setResults({
      costPriceResult: { value: '', className: '' },
      conceptPriceResult: { value: '', className: '' },
      outletPriceResult: { value: '', className: '' },
      finalResult: ''
    });
  };

  return (
    <>
      <div className="container">
        <img src={logo} alt='Logo de Adidas' className='logo' />
        <h1>Leftover Price Calculator</h1>
        <div className="input-group">
          <label htmlFor="costPrice">Precio de Coste:</label>
          <div className="input-wrapper">
            <input
              type="number"
              id="costPrice"
              value={costPrice}
              onChange={(e) => setCostPrice(e.target.value)}
              placeholder="Precio de Coste"
            />
            <span id="costPriceResult" className={results.costPriceResult.className}>
              {results.costPriceResult.value}
            </span>
          </div>
        </div>
        <div className="input-group">
          <label htmlFor="conceptPrice">Precio de Origen:</label>
          <div className="input-wrapper">
            <input
              type="number"
              id="conceptPrice"
              value={conceptPrice}
              onChange={(e) => setConceptPrice(e.target.value)}
              placeholder="Precio de Origen"
            />
            <span id="conceptPriceResult" className={results.conceptPriceResult.className}>
              {results.conceptPriceResult.value}
            </span>
          </div>
        </div>
        <div className="input-group">
          <label htmlFor="outletPrice">Precio de Outlet:</label>
          <div className="input-wrapper">
            <input
              type="number"
              id="outletPrice"
              value={outletPrice}
              onChange={(e) => setOutletPrice(e.target.value)}
              placeholder="Precio de Outlet"
            />
            <span id="outletPriceResult" className={results.outletPriceResult.className}>
              {results.outletPriceResult.value}
            </span>
          </div>
        </div>
        <button className="custom-button" onClick={calculate}>Calcular</button>
        <button className="custom-button reset-button" onClick={reset}>Reset</button>
        <div id="finalResult" className="final-result">{results.finalResult}</div>
      </div>
      <div className="footer-text">Developed by Iker Delgado</div>
    </>
  );
};

export default App;
